import { describe, it, expect, beforeEach } from "vitest";
import { healthHandler } from "../../../src/handlers/health.handler";
import { createMockEnv } from "../../helpers/mock-env";

/**
 * NOTE: healthHandler maintains a module-level in-memory cache with a 60-second TTL.
 * Tests within this file are ordered to explicitly cover both the uncached (fresh)
 * and cached code paths.
 */
describe("healthHandler", () => {
  // ── Fresh Response ──────────────────────────────────────────────────────────

  it("returns status 200", async () => {
    const env = createMockEnv({ ENVIRONMENT: "test" });
    const res = await healthHandler(env);
    expect(res.status).toBe(200);
  });

  it("returns status:'ok' in the response body", async () => {
    const env = createMockEnv({ ENVIRONMENT: "test" });
    const res = await healthHandler(env);
    const body = (await res.json()) as any;
    expect(body.status).toBe("ok");
  });

  it("returns the ENVIRONMENT from env in the body", async () => {
    const env = createMockEnv({ ENVIRONMENT: "test" });
    const res = await healthHandler(env);
    const body = (await res.json()) as any;
    expect(body.environment).toBe("test");
  });

  it("returns a valid ISO-8601 timestamp", async () => {
    const env = createMockEnv();
    const res = await healthHandler(env);
    const body = (await res.json()) as any;
    expect(body.timestamp).toBeDefined();
    expect(new Date(body.timestamp).toISOString()).toBe(body.timestamp);
  });

  it("returns Content-Type application/json", async () => {
    const env = createMockEnv();
    const res = await healthHandler(env);
    expect(res.headers.get("Content-Type")).toBe("application/json");
  });

  // ── Cached Response ─────────────────────────────────────────────────────────

  it("returns cached:true on the second call within the TTL window", async () => {
    const env = createMockEnv();

    // First call primes the cache
    await healthHandler(env);

    // Second call should hit the cache
    const cachedRes = await healthHandler(env);
    const body = (await cachedRes.json()) as any;
    expect(body.cached).toBe(true);
  });

  it("returns status:'ok' even from the cache", async () => {
    const env = createMockEnv();
    await healthHandler(env);
    const res = await healthHandler(env);
    const body = (await res.json()) as any;
    expect(body.status).toBe("ok");
  });

  it("cached response still has status 200", async () => {
    const env = createMockEnv();
    await healthHandler(env);
    const res = await healthHandler(env);
    expect(res.status).toBe(200);
  });

  it("returns the same timestamp from cache (not re-computed)", async () => {
    const env = createMockEnv();
    const firstRes = await healthHandler(env);
    const firstBody = (await firstRes.json()) as any;

    const secondRes = await healthHandler(env);
    const secondBody = (await secondRes.json()) as any;

    // The cached timestamp should equal the original
    expect(secondBody.timestamp).toBe(firstBody.timestamp);
  });
});
