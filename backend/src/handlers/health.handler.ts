import { jsonResponse } from "../utils/response";

interface CacheEntry {
  timestamp: number;
  status: string;
  environment: string;
}

let healthCache: CacheEntry | null = null;
const CACHE_TTL_MS = 60_000; // 60 seconds

export async function healthHandler(env: Env): Promise<Response> {
  const now = Date.now();

  // Return cached response if still valid
  if (healthCache && now - healthCache.timestamp < CACHE_TTL_MS) {
    return jsonResponse({
      status: healthCache.status,
      environment: healthCache.environment,
      timestamp: new Date(healthCache.timestamp).toISOString(),
      cached: true,
    });
  }

  // Compute fresh health status
  const fresh = {
    status: "ok",
    environment: env.ENVIRONMENT,
    timestamp: new Date().toISOString(),
  };

  // Update cache
  healthCache = {
    timestamp: now,
    status: fresh.status,
    environment: fresh.environment,
  };

  return jsonResponse(fresh, 200);
}