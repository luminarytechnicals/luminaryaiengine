import { randomUUID } from 'node:crypto'

export interface BenchmarkCandidate {
  prompt_id: string
  model: string
  output: string
}

export interface BlindCandidate {
  prompt_id: string
  candidate_id: string
  output: string
}

export interface BlindPack {
  created_at: string
  instructions: string
  ballots: BlindCandidate[]
  private_key: Record<string, { prompt_id: string; model: string }>
}

export interface BlindRating {
  candidate_id: string
  score: number
  notes?: string
}

/**
 * Create a shuffled, model-blind review pack. Keep private_key separate from
 * ballots and never provide it to reviewers before ratings are finalized.
 */
export function createBlindPack(
  candidates: BenchmarkCandidate[],
  random: () => number = Math.random,
): BlindPack {
  if (!Array.isArray(candidates) || candidates.length < 2) {
    throw new Error('At least two model candidates are required for a blind comparison.')
  }
  const ballots: BlindCandidate[] = []
  const private_key: BlindPack['private_key'] = {}

  for (const candidate of candidates) {
    if (!candidate.prompt_id || !candidate.model || !candidate.output?.trim()) {
      throw new Error('Each candidate must include prompt_id, model and non-empty output.')
    }
    const candidate_id = randomUUID()
    ballots.push({ prompt_id: candidate.prompt_id, candidate_id, output: candidate.output })
    private_key[candidate_id] = { prompt_id: candidate.prompt_id, model: candidate.model }
  }

  // Fisher-Yates shuffle; model names remain only in the private key.
  for (let i = ballots.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[ballots[i], ballots[j]] = [ballots[j], ballots[i]]
  }

  return {
    created_at: new Date().toISOString(),
    instructions: 'Rate each candidate without attempting to infer its model. Use the same rubric for every candidate; do not reveal model identities until all ratings are locked.',
    ballots,
    private_key,
  }
}

export function aggregateBlindRatings(
  privateKey: BlindPack['private_key'],
  ratings: BlindRating[],
): Array<{ model: string; count: number; mean_score: number }> {
  const totals = new Map<string, { count: number; total: number }>()
  for (const rating of ratings) {
    const identity = privateKey[rating.candidate_id]
    if (!identity || !Number.isFinite(rating.score) || rating.score < 0 || rating.score > 100) continue
    const current = totals.get(identity.model) || { count: 0, total: 0 }
    current.count++
    current.total += rating.score
    totals.set(identity.model, current)
  }
  return [...totals.entries()]
    .map(([model, value]) => ({
      model,
      count: value.count,
      mean_score: Math.round((value.total / value.count) * 100) / 100,
    }))
    .sort((a, b) => b.mean_score - a.mean_score)
}
