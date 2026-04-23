import type { NextRequest } from 'next/server';

/**
 * Rate limiter en mémoire, par IP + bucket.
 *
 * - Une instance unique par endpoint (le `bucket`) — évite que les limites
 *   de /contact et /sur-mesure se chevauchent.
 * - Mémoire locale suffisante en single-instance Vercel / dev. En prod
 *   multi-instances, remplacer par Upstash Redis / Vercel KV :
 *   même signature, implémentation différente.
 */

type Entry = { count: number; resetAt: number };

const stores = new Map<string, Map<string, Entry>>();

export type RateLimitResult =
  | { allowed: true; remaining: number; resetAt: number }
  | { allowed: false; remaining: 0; resetAt: number };

export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'unknown';
}

export function rateLimit({
  bucket,
  ip,
  limit,
  windowMs,
}: {
  bucket: string;
  ip: string;
  limit: number;
  windowMs: number;
}): RateLimitResult {
  const now = Date.now();
  const store = stores.get(bucket) ?? new Map<string, Entry>();
  if (!stores.has(bucket)) stores.set(bucket, store);

  const existing = store.get(ip);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    store.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    resetAt: existing.resetAt,
  };
}

/** Preset : 5 requêtes / IP / heure (formulaires contact, sur-mesure). */
export function rateLimitHourly(req: NextRequest, bucket: string) {
  return rateLimit({
    bucket,
    ip: getClientIp(req),
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
}

/** Preset : 10 requêtes / IP / minute (checkout — usage légitime fréquent). */
export function rateLimitPerMinute(
  req: NextRequest,
  bucket: string,
  limit = 10
) {
  return rateLimit({
    bucket,
    ip: getClientIp(req),
    limit,
    windowMs: 60 * 1000,
  });
}
