/**
 * API Key Authentication Middleware
 *
 * Research preview uses a simple bearer token scheme.
 * Keys are loaded from the LUMINARY_API_KEYS environment variable
 * (comma-separated list) or a single LUMINARY_API_KEY.
 *
 * If neither is set, auth is disabled (open access for local dev).
 *
 * After authentication, the request is annotated with:
 *   - req.apiKeyId  — hashed key for rate-limit bucketing
 *   - req.tier      — resolved tier (free/pro/enterprise)
 *   - req.tierConfig — full tier configuration object
 */

import type { Request, Response, NextFunction } from 'express'
import { timingSafeEqual, createHash } from 'crypto'
import { resolveTier, getTierConfig } from '../lib/tiers'

function getValidKeys(): string[] | null {
  const multi = process.env.LUMINARY_API_KEYS
  if (multi) {
    const keys = multi.split(',').map(k => k.trim()).filter(Boolean)
    if (keys.length > 0) return keys
  }
  const single = process.env.LUMINARY_API_KEY
  if (single) {
    return [single.trim()]
  }
  return null // No configured keys
}

/** Constant-time comparison of two strings (prevents timing attacks). */
function safeEqual(a: string, b: string): boolean {
  // Hash both inputs to fixed-length buffers so we never leak key length
  // via early return on length mismatch.
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

/** Hash a key for safe use as a rate-limit bucket identifier. */
function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex').slice(0, 16)
}

// Production must never start with unauthenticated API routes.
const localUnauthenticatedMode =
  process.env.NODE_ENV !== 'production' &&
  process.env.ALLOW_INSECURE_LOCAL_API === 'true'

if (!getValidKeys() && process.env.NODE_ENV === 'production') {
  throw new Error(
    'API authentication is not configured. Set LUMINARY_API_KEY or LUMINARY_API_KEYS before starting in production.',
  )
}
if (!getValidKeys() && !localUnauthenticatedMode) {
  console.warn('[luminary] API requests will be rejected until LUMINARY_API_KEY(S) are configured. For local-only development, explicitly set ALLOW_INSECURE_LOCAL_API=true.')
}

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  const validKeys = getValidKeys()

  // Anonymous access is an explicit local-development opt-in only.
  if (!validKeys) {
    if (!localUnauthenticatedMode) {
      res.status(503).json({
        error: 'API authentication is not configured. Configure LUMINARY_API_KEY(S) or explicitly enable local development mode.',
      })
      return
    }
    req.apiKeyId = 'local-development'
    const tier = resolveTier(null)
    req.tier = tier
    req.tierConfig = getTierConfig(tier)
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

  // C-1: Constant-time comparison to prevent timing attacks
  const match = validKeys.some(valid => safeEqual(key, valid))
  if (!match) {
    res.status(403).json({ error: 'Invalid API key' })
    return
  }

  // H-2: Hash the full key for rate-limit bucketing (never expose raw key material)
  req.apiKeyId = hashKey(key)

  // T-1: Resolve tier from raw key
  const tier = resolveTier(key)
  req.tier = tier
  req.tierConfig = getTierConfig(tier)

  next()
}
