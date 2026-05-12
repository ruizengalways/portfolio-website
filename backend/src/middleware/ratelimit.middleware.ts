/**
 * Rate limiting middleware using Cloudflare KV storage
 * Tracks requests per IP address and endpoint
 */

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

interface RateLimitEntry {
  requests: number;
  resetTime: number;
}

/**
 * Check rate limit for a given IP and endpoint
 * Returns true if request should be allowed, false if blocked
 */
export async function checkRateLimit(
  kv: KVNamespace | undefined,
  ip: string,
  endpoint: string
): Promise<boolean> {
  if (!kv) {
    // If KV not available, allow all requests (development mode)
    return true;
  }

  const key = `ratelimit:${ip}:${endpoint}`;
  const now = Date.now();

  try {
    const stored = await kv.get(key, "json");
    const entry = stored as RateLimitEntry | null;

    if (!entry) {
      // First request from this IP
      await kv.put(
        key,
        JSON.stringify({ requests: 1, resetTime: now + RATE_LIMIT_WINDOW }),
        { expirationTtl: 60 } // Auto-purge after 1 minute in KV
      );
      return true;
    }

    // Check if window has expired
    if (now > entry.resetTime) {
      // Window expired, reset counter
      await kv.put(
        key,
        JSON.stringify({ requests: 1, resetTime: now + RATE_LIMIT_WINDOW }),
        { expirationTtl: 60 }
      );
      return true;
    }

    // Within window, check if limit exceeded
    if (entry.requests >= MAX_REQUESTS_PER_WINDOW) {
      return false; // Rate limit exceeded
    }

    // Increment counter
    await kv.put(
      key,
      JSON.stringify({ requests: entry.requests + 1, resetTime: entry.resetTime }),
      { expirationTtl: 60 }
    );
    return true;
  } catch (error) {
    // If KV fails, allow request but log it
    console.error("Rate limit check failed:", error);
    return true;
  }
}

/**
 * Get client IP from request
 * Handles Cloudflare's CF-Connecting-IP header
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  
  // Cloudflare header (most reliable)
  const cfIp = headers.get("CF-Connecting-IP");
  if (cfIp) return cfIp;

  // Fallback headers
  return headers.get("X-Forwarded-For")?.split(",")[0]?.trim() || "unknown";
}
