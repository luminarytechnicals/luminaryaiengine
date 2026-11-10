/**
 * Dataset API Routes
 *
 * GET    /v1/dataset/stats    — Dataset statistics
 * GET    /v1/dataset/export   — Export full dataset as JSON (JSONL-compatible)
 * DELETE /v1/dataset/:id      — Delete a specific entry (for GDPR-style right to delete)
 */

import { Router } from 'express'
import { getDataset, getDatasetStats, deleteEntry, previewDatasetText } from '../lib/dataset'
import { isPublisherEnabled } from '../lib/hf-publisher'

export const datasetRoutes = Router()

/** Explain storage, publication and deletion boundaries without exposing entries. */
datasetRoutes.get('/policy', (_req, res) => {
  res.json({
    contribution: 'disabled unless both contribute_to_dataset=true and dataset_consent=true are supplied for an individual request',
    redaction: 'best-effort pattern-based redaction is applied before storage; names, addresses and contextual personal data may not be detected',
    publication: isPublisherEnabled()
      ? 'automatic publication is enabled for this deployment; contributed records may be copied to the configured Hugging Face dataset repository (visibility depends on that repository's settings)'
      : 'automatic publication is not configured for this deployment',
    deletion: 'DELETE /v1/dataset/:id removes an entry only while it remains in the live in-memory buffer; already published or copied files cannot be reliably recalled',
  })
})

/** Preview redaction without storing or publishing submitted content. */
datasetRoutes.post('/preview', (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : []
  const preview = messages
    .filter((message: any) => message && ['user', 'assistant'].includes(message.role))
    .map((message: any) => ({
      role: message.role,
      ...previewDatasetText(String(message.content || '')),
    }))
  const response = previewDatasetText(String(req.body?.response || ''))
  res.json({
    stored: false,
    published: false,
    consent_required: true,
    messages: preview,
    response,
    warning: 'Review this preview carefully. Automated redaction cannot guarantee detection of names, addresses, or all sensitive context.',
  })
})

datasetRoutes.get('/stats', (_req, res) => {
  res.json(getDatasetStats())
})

datasetRoutes.get('/export', (req, res) => {
  const format = req.query.format || 'json'
  const allowedFormats = req.tierConfig?.datasetExportFormats || []
  if (!allowedFormats.includes(format as 'json' | 'jsonl')) {
    res.status(403).json({ error: 'Dataset export is not available for this API tier.' })
    return
  }
  const dataset = getDataset()

  if (format === 'jsonl') {
    // JSONL format — one JSON object per line, ideal for HF Datasets
    res.setHeader('Content-Type', 'application/x-ndjson')
    res.setHeader('Content-Disposition', 'attachment; filename="luminary-ai-dataset.jsonl"')
    const lines = dataset.map(entry => JSON.stringify(entry))
    res.send(lines.join('\n') + '\n')
  } else {
    // Standard JSON array
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', 'attachment; filename="luminary-ai-dataset.json"')
    res.json({
      metadata: {
        name: 'LUMINARY AI Research Dataset',
        description: 'Opt-in collection of LLM interactions with AutoTune, Parseltongue, and ULTRAPLINIAN pipeline metadata.',
        license: 'AGPL-3.0',
        source: 'configured dataset repository',
        exported_at: new Date().toISOString(),
        total_entries: dataset.length,
      },
      data: dataset,
    })
  }
})

datasetRoutes.delete('/:id', (req, res) => {
  const { id } = req.params
  const deleted = deleteEntry(id)

  if (deleted) {
    res.json({ deleted: true, id })
  } else {
    res.status(404).json({ error: 'Entry not found', id })
  }
})
