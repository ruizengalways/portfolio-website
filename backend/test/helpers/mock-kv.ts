import { vi } from "vitest";

/**
 * Creates an in-memory KVNamespace mock for testing.
 * Each call returns a fresh, isolated instance.
 */
export function createMockKV(): KVNamespace {
  const store = new Map<string, string>();

  return {
    get: vi.fn(async (key: string, typeOrOptions?: any) => {
      const raw = store.get(key) ?? null;
      if (raw === null) return null;
      const type =
        typeof typeOrOptions === "string"
          ? typeOrOptions
          : typeOrOptions?.type;
      if (type === "json") return JSON.parse(raw);
      if (type === "arrayBuffer")
        return new TextEncoder().encode(raw).buffer;
      if (type === "stream") return new Response(raw).body;
      return raw;
    }),
    put: vi.fn(async (key: string, value: string | ArrayBuffer | ReadableStream, _options?: any) => {
      store.set(key, typeof value === "string" ? value : String(value));
    }),
    delete: vi.fn(async (key: string) => {
      store.delete(key);
    }),
    list: vi.fn(async (options?: any) => {
      const prefix: string = options?.prefix ?? "";
      const keys = [...store.keys()]
        .filter((k) => k.startsWith(prefix))
        .map((name) => ({ name, expiration: undefined, metadata: undefined }));
      return { keys, list_complete: true, cursor: "", cacheStatus: null };
    }),
    getWithMetadata: vi.fn(async (key: string, typeOrOptions?: any) => {
      const raw = store.get(key) ?? null;
      const type =
        typeof typeOrOptions === "string"
          ? typeOrOptions
          : typeOrOptions?.type;
      let value: any = raw;
      if (raw !== null && type === "json") value = JSON.parse(raw);
      return { value, metadata: null, cacheStatus: null };
    }),
  } as unknown as KVNamespace;
}

/**
 * Creates a KVNamespace mock that throws on every operation.
 */
export function createFailingKV(): KVNamespace {
  const err = new Error("KV operation failed");
  return {
    get: vi.fn(async () => { throw err; }),
    put: vi.fn(async () => { throw err; }),
    delete: vi.fn(async () => { throw err; }),
    list: vi.fn(async () => { throw err; }),
    getWithMetadata: vi.fn(async () => { throw err; }),
  } as unknown as KVNamespace;
}
