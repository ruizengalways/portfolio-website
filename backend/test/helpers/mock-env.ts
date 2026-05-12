import { createMockKV } from "./mock-kv";

/**
 * Creates a fully-typed mock Env for testing without real Cloudflare bindings.
 */
export function createMockEnv(overrides?: Partial<Env>): Env {
  return {
    ENVIRONMENT: "test",
    FRONTEND_URL: "http://localhost:3000",
    ADMIN_API_KEY: "test-admin-key-123",
    MESSAGES_KV: createMockKV(),
    RATE_LIMIT_KV: createMockKV(),
    ...overrides,
  } as Env;
}

/**
 * Creates an Env where MESSAGES_KV and RATE_LIMIT_KV are undefined
 * to simulate missing bindings.
 */
export function createEnvWithoutKV(): Env {
  return {
    ENVIRONMENT: "test",
    FRONTEND_URL: "http://localhost:3000",
    ADMIN_API_KEY: "test-admin-key-123",
    MESSAGES_KV: undefined as unknown as KVNamespace,
    RATE_LIMIT_KV: undefined as unknown as KVNamespace,
  } as Env;
}
