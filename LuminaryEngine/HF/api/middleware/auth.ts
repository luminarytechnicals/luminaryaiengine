/**
 * API Key Authentication Middleware
 *
 * Research preview uses a simple bearer token scheme.
 * Keys are loaded from the LUMINARY_API_KEYS environment variable
 * (comma-separated list) or a single LUMINARY_API_KEY.
 *
 * Production requires a key. Anonymous access is local-only and explicit.
 */

import type { Request, Response, NextFunction } from 'express'
import { createHash, timingSafeEqual } from 'node:crypto'

function getValidKeys(): Set<string> | null {
  const multi = process.env.LUMINARY_API_KEYS
  if (multi) {
    return new Set(multi.split(',').map(k => k.trim()).filter(Boolean))
  }
  const single = process.env.LUMINARY_API_KEY
  if (single) {
    return new Set([single.trim()])
  }
  return null // No configured keys
}

const localUnauthenticatedMode = process.env.NODE_ENV !== 'production' && process.env.ALLOW_INSECURE_LOCAL_API === 'true'

if (!getValidKeys() && process.env.NODE_ENV === 'production') {
  throw new Error('Set LUMINARY_API_KEY or LUMINARY_API_KEYS before starting the API in production.')
}

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const validKeys = getValidKeys()

  if (!validKeys) {
    if (!localUnauthenticatedMode) {
      res.status(503).json({ error: 'API authentication is not configured. Set LUMINARY_API_KEY(S).' })
      return
    }
    ;(req as any).apiKeyId = 'local-development'
    next()
    return
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Missing or invalid Authorization header. Use: Bearer <your-api-key>',
    })
    return
  }

  const key = authHeader.slice(7).trim()
  const keyHash = createHash('sha256').update(key).digest()
  const matches = [...validKeys].some(valid => timingSafeEqual(keyHash, createHash('sha256').update(valid).digest()))
  if (!matches) {
    res.status(403).json({ error: 'Invalid API key' })
    return
  }

  ;(req as any).apiKeyId = createHash('sha256').update(key).digest('hex').slice(0, 16)
  next()
}
