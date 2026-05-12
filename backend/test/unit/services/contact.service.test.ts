import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendContactMessage } from "../../../src/services/contact.service";
import * as repo from "../../../src/repositories/message.repository";
import { createMockEnv } from "../../helpers/mock-env";

// Mock the entire repository layer so the service is tested in isolation
vi.mock("../../../src/repositories/message.repository", () => ({
  saveMessage: vi.fn().mockResolvedValue(undefined),
}));

describe("sendContactMessage", () => {
  const validInput = {
    name: "Alice",
    email: "alice@example.com",
    message: "Hello, this is a long enough message!",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(repo.saveMessage).mockResolvedValue(undefined);
  });

  // ── Happy Path ──────────────────────────────────────────────────────────────

  it("resolves without error for a valid input", async () => {
    const env = createMockEnv();
    await expect(sendContactMessage(validInput, env)).resolves.toBeUndefined();
  });

  it("calls saveMessage once with the correct shape", async () => {
    const env = createMockEnv();
    await sendContactMessage(validInput, env);

    expect(repo.saveMessage).toHaveBeenCalledOnce();
    const [savedMsg, calledEnv] = vi.mocked(repo.saveMessage).mock.calls[0];
    expect(savedMsg.name).toBe(validInput.name);
    expect(savedMsg.email).toBe(validInput.email);
    expect(savedMsg.message).toBe(validInput.message);
    expect(savedMsg.createdAt).toBeDefined();
    expect(calledEnv).toBe(env);
  });

  it("sets a valid ISO-8601 createdAt timestamp", async () => {
    const env = createMockEnv();
    await sendContactMessage(validInput, env);

    const savedMsg = vi.mocked(repo.saveMessage).mock.calls[0][0];
    expect(() => new Date(savedMsg.createdAt)).not.toThrow();
    expect(new Date(savedMsg.createdAt).toISOString()).toBe(savedMsg.createdAt);
  });

  it("accepts a message of exactly 10 characters (boundary)", async () => {
    const env = createMockEnv();
    await expect(
      sendContactMessage({ ...validInput, message: "1234567890" }, env)
    ).resolves.toBeUndefined();
  });

  it("accepts a very long message", async () => {
    const env = createMockEnv();
    const longMsg = "x".repeat(10_000);
    await expect(
      sendContactMessage({ ...validInput, message: longMsg }, env)
    ).resolves.toBeUndefined();
  });

  // ── Business Rule: minimum message length ───────────────────────────────────

  it("throws when message is shorter than 10 characters", async () => {
    const env = createMockEnv();
    await expect(
      sendContactMessage({ ...validInput, message: "short" }, env)
    ).rejects.toThrow("Message is too short");
  });

  it("throws when message is exactly 9 characters (boundary)", async () => {
    const env = createMockEnv();
    await expect(
      sendContactMessage({ ...validInput, message: "123456789" }, env)
    ).rejects.toThrow("Message is too short");
  });

  it("throws when message is empty", async () => {
    const env = createMockEnv();
    await expect(
      sendContactMessage({ ...validInput, message: "" }, env)
    ).rejects.toThrow("Message is too short");
  });

  it("does NOT call saveMessage when message is too short", async () => {
    const env = createMockEnv();
    try {
      await sendContactMessage({ ...validInput, message: "tiny" }, env);
    } catch {
      // expected
    }
    expect(repo.saveMessage).not.toHaveBeenCalled();
  });

  // ── Repository failure propagation ──────────────────────────────────────────

  it("propagates errors thrown by saveMessage", async () => {
    vi.mocked(repo.saveMessage).mockRejectedValueOnce(
      new Error("Failed to persist message")
    );
    const env = createMockEnv();

    await expect(sendContactMessage(validInput, env)).rejects.toThrow(
      "Failed to persist message"
    );
  });
});
