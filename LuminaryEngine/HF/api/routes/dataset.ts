/**
 * Dataset API Routes
 *
 * GET    /v1/dataset/stats    — Dataset statistics
 * GET    /v1/dataset/export   — Export full dataset as JSON (JSONL-compatible)
 * DELETE /v1/dataset/:id      — Delete a specific entry (for GDPR-style right to delete)
 */

import { Router } from 'express'
import { getDataset, getDatasetStats, deleteEntry, previewDatasetText } from '../lib/dataset'

export const datasetRoutes = Router()

datasetRoutes.get('/policy', (_req, res) => {
  res.json({
    contribution: 'disabled unless both contribute_to_dataset=true and dataset_consent=true are supplied for an individual request',
    redaction: 'best-effort pattern-based redaction; names, addresses and contextual personal data may not be detected',
    publication: 'this HF API dataset buffer is in-memory; deployment-specific exports may be copied elsewhere',
    deletion: 'DELETE /v1/dataset/:id removes an entry only while it remains in the live in-memory buffer',
  })
})

datasetRoutes.post('/preview', (req, res) => {
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : []
  res.json({
    stored: false,
    published: false,
    consent_required: true,
    messages: messages
      .filter((message: any) => message && ['user', 'assistant'].includes(message.role))
      .map((message: any) => ({ role: message.role, ...previewDatasetText(String(message.content || '')) })),
    response: previewDatasetText(String(req.body?.response || '')),
    warning: 'Automated redaction cannot guarantee detection of names, addresses or all sensitive context.',
  })
})

datasetRoutes.get('/stats', (_req, res) => {
  res.json(getDatasetStats())
})

datasetRoutes.get('/export', (req, res) => {
  const format = req.query.format || 'json'
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
        source: 'https://github.com/luminarytechnicals/luminaryaiengine',
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
