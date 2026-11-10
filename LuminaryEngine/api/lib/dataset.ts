/**
 * Open Dataset Collection Engine
 *
 * Opt-in data collection for building an open source research dataset.
 * Researchers who enable `contribute_to_dataset: true` in their requests
 * have their (anonymized) interaction data stored for the community.
 *
 * Stored data:
 * - Messages sent and received (no API keys, no IPs)
 * - AutoTune parameters and context detection results
 * - Model used and response metadata
 * - User feedback/ratings
 * - Parseltongue and STM pipeline metadata
 *
 * Privacy controls:
 * - Requires both contribute_to_dataset=true and dataset_consent=true
 * - Applies best-effort pattern-based redaction before storage
 * - Redaction is not a guarantee that all personal or sensitive data is detected
 * - Published copies cannot be reliably recalled; see the dataset policy endpoint
 * - Caller can request deletion while an entry remains in the live buffer
 *
 * Persistence: auto-publishes to HuggingFace when buffer fills up.
 */

import { randomUUID } from 'crypto'
import { registerDatasetStore, checkDatasetThreshold } from './hf-publisher'

/**
 * Best-effort redaction for common machine-detectable identifiers.
 * This cannot reliably identify names, street addresses, or all contextual PII.
 * Dataset publication must therefore remain explicit and opt-in.
 */
export function redactDatasetText(value: string): string {
  return String(value || '')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED_EMAIL]')
    .replace(/\b(?:sk-or-v1-|sk-|hf_)[A-Za-z0-9_-]{12,}\b/g, '[REDACTED_SECRET]')
    .replace(/\b(password|passwd|api[_ -]?key|access[_ -]?token|secret)\s*[:=]\s*[^\s,;]+/gi, '$1=[REDACTED]')
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, '[REDACTED_PAYMENT_CARD]')
    .replace(/\b(?:\+?\d[\d .()/-]{7,}\d)\b/g, '[REDACTED_PHONE]')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[REDACTED_IP]')
    .replace(/([?&](?:token|key|secret|password|auth)=)[^&#\s]+/gi, '$1[REDACTED]');
}

export function previewDatasetText(value: string): { text: string; changed: boolean } {
  const original = String(value || '');
  const text = redactDatasetText(original);
  return { text, changed: text !== original };
}

// ── Types ────────────────────────────────────────────────────────────

export interface DatasetEntry {
  id: string
  timestamp: number

  // Request metadata
  endpoint: string  // which API endpoint was called
  model: string
  mode: 'standard' | 'ultraplinian'

  // Messages (stripped of system prompts to avoid leaking custom prompts)
  messages: Array<{ role: string; content: string }>
  response: string

  // AutoTune data
  autotune?: {
    strategy: string
    detected_context: string
    confidence: number
    params: Record<string, number>
    reasoning: string
  }

  // Parseltongue data
  parseltongue?: {
    triggers_found: string[]
    technique_used: string
    transformations_count: number
  }

  // STM data
  stm?: {
    modules_applied: string[]
  }

  // ULTRAPLINIAN race data
  ultraplinian?: {
    tier: string
    models_queried: string[]
    winner_model: string
    all_scores: Array<{ model: string; score: number; duration_ms: number; success: boolean }>
    total_duration_ms: number
  }

  // Feedback (added later via POST /v1/feedback if user rates)
  feedback?: {
    rating: 1 | -1
    heuristics?: {
      response_length: number
      repetition_score: number
      vocabulary_diversity: number
    }
  }
}

// ── In-Memory Store with Auto-Publish ────────────────────────────────
// Buffer auto-flushes to HuggingFace when it hits 80% capacity.
// Falls back to FIFO eviction if HF publishing is not configured.

let dataset: DatasetEntry[] = []
const MAX_ENTRIES = 10000 // Cap to prevent unbounded memory growth

// Track how many entries have been flushed so we can use index-based draining
// instead of copying the entire array on each snapshot.
let datasetFlushIndex = 0

// Register with HF publisher so it can snapshot/clear our buffer
registerDatasetStore({
  snapshot: () => dataset.slice(datasetFlushIndex),
  clear: (count: number) => {
    datasetFlushIndex += count
    // Compact the array when more than half has been drained to free memory
    if (datasetFlushIndex > dataset.length / 2) {
      dataset = dataset.slice(datasetFlushIndex)
      datasetFlushIndex = 0
    }
  },
})

// ── Public API ───────────────────────────────────────────────────────

export function addEntry(entry: Omit<DatasetEntry, 'id' | 'timestamp'>): string {
  const id = randomUUID()
  const record: DatasetEntry = {
    ...entry,
    messages: entry.messages.map(message => ({
      ...message,
      content: redactDatasetText(message.content),
    })),
    response: redactDatasetText(entry.response),
    autotune: entry.autotune
      ? { ...entry.autotune, reasoning: redactDatasetText(entry.autotune.reasoning || '') }
      : undefined,
    id,
    timestamp: Date.now(),
  }

  dataset.push(record)

  // Auto-flush to HF when approaching capacity (async, non-blocking)
  checkDatasetThreshold(dataset.length, MAX_ENTRIES)

  // Evict oldest entries if over cap (fallback if HF not configured or failed)
  if (dataset.length > MAX_ENTRIES) {
    dataset = dataset.slice(dataset.length - MAX_ENTRIES)
  }

  return id
}

export function addFeedbackToEntry(
  entryId: string,
  feedback: DatasetEntry['feedback'],
): boolean {
  const entry = dataset.find(e => e.id === entryId)
  if (!entry) return false
  entry.feedback = feedback
  return true
}

export function deleteEntry(id: string): boolean {
  const idx = dataset.findIndex(e => e.id === id)
  if (idx === -1) return false
  dataset.splice(idx, 1)
  return true
}

export function getDataset(): DatasetEntry[] {
  return [...dataset]
}

export function getDatasetStats(): {
  total_entries: number
  entries_with_feedback: number
  mode_breakdown: Record<string, number>
  model_breakdown: Record<string, number>
  context_breakdown: Record<string, number>
  oldest_entry: number | null
  newest_entry: number | null
} {
  const modeBreakdown: Record<string, number> = {}
  const modelBreakdown: Record<string, number> = {}
  const contextBreakdown: Record<string, number> = {}
  let withFeedback = 0

  for (const entry of dataset) {
    modeBreakdown[entry.mode] = (modeBreakdown[entry.mode] || 0) + 1
    modelBreakdown[entry.model] = (modelBreakdown[entry.model] || 0) + 1
    if (entry.autotune?.detected_context) {
      const ctx = entry.autotune.detected_context
      contextBreakdown[ctx] = (contextBreakdown[ctx] || 0) + 1
    }
    if (entry.feedback) withFeedback++
  }

  return {
    total_entries: dataset.length,
    entries_with_feedback: withFeedback,
    mode_breakdown: modeBreakdown,
    model_breakdown: modelBreakdown,
    context_breakdown: contextBreakdown,
    oldest_entry: dataset.length > 0 ? dataset[0].timestamp : null,
    newest_entry: dataset.length > 0 ? dataset[dataset.length - 1].timestamp : null,
  }
}
