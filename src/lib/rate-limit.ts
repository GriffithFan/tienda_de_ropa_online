import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  keyPrefix: string;
  limit: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  return forwardedFor || realIp || 'unknown';
}

export function rateLimit(request: NextRequest, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${options.keyPrefix}:${getClientIp(request)}`;
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  if (entry.count >= options.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

    return NextResponse.json(
      { error: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.' },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
        },
      }
    );
  }

  entry.count += 1;
  store.set(key, entry);
  return null;
}