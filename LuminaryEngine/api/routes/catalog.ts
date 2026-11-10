import { Router } from 'express'

export const catalogRoutes = Router()

type OpenRouterModel = {
  id: string
  name?: string
  description?: string
  context_length?: number
  pricing?: { prompt?: string; completion?: string; request?: string; image?: string }
  architecture?: { modality?: string; input_modalities?: string[]; output_modalities?: string[] }
}

let cachedModels: OpenRouterModel[] = []
let cachedAt = 0
const CACHE_TTL_MS = 5 * 60 * 1000

async function loadModels(): Promise<OpenRouterModel[]> {
  if (cachedModels.length && Date.now() - cachedAt < CACHE_TTL_MS) return cachedModels
  const response = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { 'HTTP-Referer': 'https://luminaryaiengine.dpdns.org', 'X-Title': 'Luminary AI Engine' },
  })
  if (!response.ok) throw new Error(`OpenRouter model catalogue returned ${response.status}`)
  const payload = await response.json() as { data?: OpenRouterModel[] }
  if (!Array.isArray(payload.data)) throw new Error('OpenRouter returned an invalid model catalogue')
  cachedModels = payload.data
  cachedAt = Date.now()
  return cachedModels
}

catalogRoutes.get('/models', async (_req, res) => {
  try {
    const models = await loadModels()
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
    res.json({
      source: 'OpenRouter model catalogue',
      refreshed_at: new Date(cachedAt).toISOString(),
      count: models.length,
      models: models.map(model => ({
        id: model.id,
        name: model.name || model.id,
        description: model.description || '',
        context_length: model.context_length ?? null,
        modality: model.architecture?.modality ?? null,
        input_modalities: model.architecture?.input_modalities ?? [],
        output_modalities: model.architecture?.output_modalities ?? [],
        pricing_usd_per_token: {
          prompt: model.pricing?.prompt ?? null,
          completion: model.pricing?.completion ?? null,
          request: model.pricing?.request ?? null,
          image: model.pricing?.image ?? null,
        },
      })),
    })
  } catch (error) {
    res.status(502).json({ error: 'Model catalogue is temporarily unavailable', detail: (error as Error).message })
  }
})

catalogRoutes.post('/estimate', async (req, res) => {
  const modelId = String(req.body?.model || '')
  const inputTokens = Number(req.body?.input_tokens)
  const outputTokens = Number(req.body?.output_tokens)
  if (!modelId || !Number.isSafeInteger(inputTokens) || !Number.isSafeInteger(outputTokens) ||
      inputTokens < 0 || outputTokens < 0 || inputTokens > 2_000_000 || outputTokens > 1_000_000) {
    res.status(400).json({ error: 'Provide a model and non-negative integer input_tokens/output_tokens within supported bounds.' })
    return
  }
  try {
    const models = await loadModels()
    const model = models.find(item => item.id === modelId)
    if (!model) {
      res.status(404).json({ error: 'Model not found in the current OpenRouter catalogue.' })
      return
    }
    const promptRate = Number(model.pricing?.prompt)
    const completionRate = Number(model.pricing?.completion)
    if (!Number.isFinite(promptRate) || !Number.isFinite(completionRate)) {
      res.status(422).json({ error: 'Pricing is not available for this model.' })
      return
    }
    const inputCost = inputTokens * promptRate
    const outputCost = outputTokens * completionRate
    res.json({
      model: modelId,
      currency: 'USD',
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      estimated_input_cost_usd: inputCost,
      estimated_output_cost_usd: outputCost,
      estimated_total_cost_usd: inputCost + outputCost,
      note: 'Estimate only. Provider routing, cached tokens, tools, images and provider-specific billing may change the final charge.',
    })
  } catch (error) {
    res.status(502).json({ error: 'Cost estimate is temporarily unavailable', detail: (error as Error).message })
  }
})
