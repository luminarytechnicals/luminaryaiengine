import test from 'node:test'
import assert from 'node:assert/strict'
import { redactDatasetText, addEntry, getDataset } from '../api/lib/dataset'
import { createBlindPack, aggregateBlindRatings } from './blind-evaluation'
import { TIER_CONFIGS } from '../api/lib/tiers'

test('dataset redaction masks common direct identifiers and credentials', () => {
  const input = 'Email alice@example.com token sk-or-v1-12345678901234567890 phone +1 202 555 0188'
  const output = redactDatasetText(input)
  assert.match(output, /REDACTED_EMAIL/)
  assert.match(output, /REDACTED_SECRET/)
  assert.match(output, /REDACTED_PHONE/)
  assert.doesNotMatch(output, /alice@example.com/)
})

test('dataset entries are redacted again at storage boundary', () => {
  const id = addEntry({
    endpoint: '/test',
    model: 'test/model',
    mode: 'standard',
    messages: [{ role: 'user', content: 'Contact alice@example.com' }],
    response: 'Use token sk-or-v1-12345678901234567890',
  })
  const entry = getDataset().find(item => item.id === id)
  assert.ok(entry)
  assert.match(entry!.messages[0].content, /REDACTED_EMAIL/)
  assert.match(entry!.response, /REDACTED_SECRET/)
})

test('blind benchmark pack does not expose model names in reviewer ballots', () => {
  const pack = createBlindPack([
    { prompt_id: 'p1', model: 'vendor/model-a', output: 'Answer A' },
    { prompt_id: 'p1', model: 'vendor/model-b', output: 'Answer B' },
  ], () => 0.25)
  assert.equal(pack.ballots.length, 2)
  assert.ok(pack.ballots.every(item => !('model' in item)))
  assert.equal(Object.keys(pack.private_key).length, 2)
  const results = aggregateBlindRatings(pack.private_key, pack.ballots.map((item, i) => ({
    candidate_id: item.candidate_id,
    score: i === 0 ? 90 : 70,
  })))
  assert.equal(results.length, 2)
})

test('API tiers impose increasing but finite output-token ceilings', () => {
  assert.equal(TIER_CONFIGS.free.maxOutputTokens, 2048)
  assert.equal(TIER_CONFIGS.pro.maxOutputTokens, 4096)
  assert.equal(TIER_CONFIGS.enterprise.maxOutputTokens, 8192)
})
