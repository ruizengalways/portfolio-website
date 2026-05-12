import { describe, it, expect, beforeEach } from "vitest";
import {
  saveMessage,
  recordVisit,
  getVisitorStats,
  type StoredMessage,
} from "../../../src/repositories/message.repository";
import { createMockEnv, createEnvWithoutKV } from "../../helpers/mock-env";
import { createMockKV } from "../../helpers/mock-kv";

const validMessage: StoredMessage = {
  name: "Alice",
  email: "alice@example.com",
  message: "Hello from the test suite!",
  createdAt: new Date().toISOString(),
};

// ── saveMessage ───────────────────────────────────────────────────────────────

describe("saveMessage", () => {
  it("throws when MESSAGES_KV binding is not configured", async () => {
    const env = createEnvWithoutKV();
    await expect(saveMessage(validMessage, env)).rejects.toThrow(
      "Message storage not available"
    );
  });

  it("calls kv.put with a message key and JSON-encoded message", async () => {
    const env = createMockEnv();
    await saveMessage(validMessage, env);

    // put should have been called at least once for the message itself
    expect(env.MESSAGES_KV.put).toHaveBeenCalled();

    // Verify the stored value contains the message fields
    const putCalls = (env.MESSAGES_KV.put as any).mock.calls as [string, string][];
    const [messageKey, messageValue] = putCalls.find(([k]) =>
      k.startsWith("message:")
    )!;
    expect(messageKey).toMatch(/^message:\d{4}-\d{2}-\d{2}:/);
    const stored = JSON.parse(messageValue);
    expect(stored.name).toBe(validMessage.name);
    expect(stored.email).toBe(validMessage.email);
    expect(stored.message).toBe(validMessage.message);
  });

  it("stores message with a unique key (no two calls produce identical keys)", async () => {
    const env = createMockEnv();
    await saveMessage(validMessage, env);
    await saveMessage(validMessage, env);

    const putCalls = (env.MESSAGES_KV.put as any).mock.calls as [string, string][];
    const msgKeys = putCalls
      .filter(([k]) => k.startsWith("message:"))
      .map(([k]) => k);
    const unique = new Set(msgKeys);
    expect(unique.size).toBe(msgKeys.length);
  });

  it("increments the totalMessages counter after saving", async () => {
    const env = createMockEnv();
    await saveMessage(validMessage, env);

    // stats:visitor key should be written
    const putCalls = (env.MESSAGES_KV.put as any).mock.calls as [string, string][];
    const statsCall = putCalls.find(([k]) => k === "stats:visitor");
    expect(statsCall).toBeDefined();
    const stats = JSON.parse(statsCall![1]);
    expect(stats.totalMessages).toBe(1);
  });

  it("propagates KV errors as a user-friendly message", async () => {
    const failingKV = createMockKV();
    (failingKV.put as any).mockRejectedValue(new Error("KV unavailable"));
    const env = createMockEnv({ MESSAGES_KV: failingKV });

    await expect(saveMessage(validMessage, env)).rejects.toThrow(
      "Failed to persist message"
    );
  });
});

// ── recordVisit ───────────────────────────────────────────────────────────────

describe("recordVisit", () => {
  it("throws when MESSAGES_KV is not configured", async () => {
    // Unlike getVisitorStats, recordVisit throws on missing binding
    const env = createEnvWithoutKV();
    await expect(recordVisit(env)).rejects.toThrow("Visitor tracking not available");
  });

  it("increments the totalVisits counter in KV stats", async () => {
    const env = createMockEnv();
    await recordVisit(env);

    const putCalls = (env.MESSAGES_KV.put as any).mock.calls as [string, string][];
    const statsCall = putCalls.find(([k]) => k === "stats:visitor");
    expect(statsCall).toBeDefined();
    const stats = JSON.parse(statsCall![1]);
    expect(stats.totalVisits).toBe(1);
  });

  it("increments totalVisits cumulatively across multiple calls", async () => {
    const env = createMockEnv();
    await recordVisit(env);
    await recordVisit(env);
    await recordVisit(env);

    const stats = await getVisitorStats(env);
    expect(stats.totalVisits).toBe(3);
  });

  it("does NOT throw when KV put fails (non-fatal, swallows error)", async () => {
    const failingKV = createMockKV();
    (failingKV.put as any).mockRejectedValue(new Error("KV write failed"));
    const env = createMockEnv({ MESSAGES_KV: failingKV });

    await expect(recordVisit(env)).resolves.toBeUndefined();
  });
});

// ── getVisitorStats ───────────────────────────────────────────────────────────

describe("getVisitorStats", () => {
  it("returns zero-value defaults when MESSAGES_KV is not configured", async () => {
    const env = createEnvWithoutKV();
    const stats = await getVisitorStats(env);
    expect(stats.totalVisits).toBe(0);
    expect(stats.totalMessages).toBe(0);
    expect(stats.lastUpdated).toBeDefined();
  });

  it("returns zero-value defaults when no stats key exists in KV", async () => {
    const env = createMockEnv();
    const stats = await getVisitorStats(env);
    expect(stats.totalVisits).toBe(0);
    expect(stats.totalMessages).toBe(0);
  });

  it("returns parsed stats when the key exists in KV", async () => {
    const env = createMockEnv();
    const stored = {
      totalVisits: 42,
      totalMessages: 7,
      lastUpdated: new Date().toISOString(),
    };
    await env.MESSAGES_KV.put("stats:visitor", JSON.stringify(stored));

    const stats = await getVisitorStats(env);
    expect(stats.totalVisits).toBe(42);
    expect(stats.totalMessages).toBe(7);
  });

  it("returns zero defaults when KV get throws (fault tolerance)", async () => {
    const failingKV = createMockKV();
    (failingKV.get as any).mockRejectedValue(new Error("KV read error"));
    const env = createMockEnv({ MESSAGES_KV: failingKV });

    const stats = await getVisitorStats(env);
    expect(stats.totalVisits).toBe(0);
    expect(stats.totalMessages).toBe(0);
  });

  it("returns a lastUpdated ISO string", async () => {
    const env = createMockEnv();
    const stats = await getVisitorStats(env);
    expect(() => new Date(stats.lastUpdated)).not.toThrow();
  });
});
