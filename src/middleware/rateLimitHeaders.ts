import { Request, Response, NextFunction } from "express"

const WINDOW_MS = 60_000
const MAX_REQUESTS = 100

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

function clientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"]
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() ?? "unknown"
  }
  return req.ip ?? req.socket.remoteAddress ?? "unknown"
}

function getOrCreateBucket(key: string, now: number): Bucket {
  let bucket = buckets.get(key)
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + WINDOW_MS }
    buckets.set(key, bucket)
  }
  return bucket
}

export function rateLimitHeaders(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const now = Date.now()
  const key = clientKey(req)
  const bucket = getOrCreateBucket(key, now)
  const resetEpoch = Math.ceil(bucket.resetAt / 1000)
  const remaining = Math.max(0, MAX_REQUESTS - bucket.count - 1)

  res.setHeader("X-RateLimit-Limit", String(MAX_REQUESTS))
  res.setHeader("X-RateLimit-Remaining", String(remaining))
  res.setHeader("X-RateLimit-Reset", String(resetEpoch))

  if (bucket.count >= MAX_REQUESTS) {
    const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    res.setHeader("Retry-After", String(retryAfter))
    res.status(429).json({
      success: false,
      message: "Too many requests",
    })
    return
  }

  bucket.count += 1
  next()
}
