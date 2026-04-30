type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

export function checkInMemoryRateLimit(input: { key: string; windowMs: number; max: number }) {
  const now = Date.now();
  const bucket = buckets.get(input.key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(input.key, { count: 1, resetAt: now + input.windowMs });
    return { ok: true, remaining: input.max - 1, resetAt: now + input.windowMs };
  }

  if (bucket.count >= input.max) {
    return { ok: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { ok: true, remaining: Math.max(0, input.max - bucket.count), resetAt: bucket.resetAt };
}

export function rateLimitHeaders(result: { remaining: number; resetAt: number }) {
  return {
    "x-ratelimit-remaining": String(result.remaining),
    "x-ratelimit-reset": String(Math.ceil(result.resetAt / 1000)),
  };
}
