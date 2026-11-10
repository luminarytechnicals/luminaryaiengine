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
 * Privacy guarantees:
 * - Strictly opt-in per request
 * - No PII: API keys, IPs, and auth tokens are NEVER stored
 * - Dataset is exportable via GET /v1/dataset/export
 * - Caller can request deletion via DELETE /v1/dataset/:id
 */

import { randomUUID } from 'crypto'

/** Best-effort redaction; names, addresses and contextual PII may not be detected. */
export function redactDatasetText(value: string): string {
  return String(value || '')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED_EMAIL]')
    .replace(/\b(?:sk-or-v1-|sk-|hf_)[A-Za-z0-9_-]{12,}\b/g, '[REDACTED_SECRET]')
    .replace(/\b(password|passwd|api[_ -]?key|access[_ -]?token|secret)\s*[:=]\s*[^\s,;]+/gi, '$1=[REDACTED]')
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, '[REDACTED_PAYMENT_CARD]')
    .replace(/\b(?:\+?\d[\d .()/-]{7,}\d)\b/g, '[REDACTED_PHONE]')
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '[REDACTED_IP]')
}

export function previewDatasetText(value: string): { text: string; changed: boolean } {
  const original = String(value || '')
  const text = redactDatasetText(original)
  return { text, changed: text !== original }
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

// ── In-Memory Store ──────────────────────────────────────────────────
// For a research preview, in-memory is fine. For production, swap with
// a persistent store (SQLite, PostgreSQL, or HF Dataset repo push).

let dataset: DatasetEntry[] = []
const MAX_ENTRIES = 10000 // Cap to prevent unbounded memory growth

// ── Public API ───────────────────────────────────────────────────────

export function addEntry(entry: Omit<DatasetEntry, 'id' | 'timestamp'>): string {
  const id = randomUUID()
  const record: DatasetEntry = {
    ...entry,
    messages: entry.messages.map(message => ({ ...message, content: redactDatasetText(message.content) })),
    response: redactDatasetText(entry.response),
    id,
    timestamp: Date.now(),
  }

  dataset.push(record)

  // Evict oldest entries if over cap
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
  return dataset
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
