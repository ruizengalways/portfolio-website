import { describe, it, expect } from "vitest";
import { contactHandler } from "../../../src/handlers/contact.handler";
import { createMockEnv, createEnvWithoutKV } from "../../helpers/mock-env";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeContactRequest(body: unknown, contentType = "application/json"): Request {
  return new Request("http://example.com/contact", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body: JSON.stringify(body),
  });
}

// ── contactHandler integration ────────────────────────────────────────────────

describe("contactHandler", () => {
  // ── 201 Happy Path ──────────────────────────────────────────────────────────

  it("returns 201 and success:true for a valid payload", async () => {
    const env = createMockEnv();
    const req = makeContactRequest({
      name: "Alice",
      email: "alice@example.com",
      message: "This is a valid message that is long enough.",
    });

    const res = await contactHandler(req, env);
    expect(res.status).toBe(201);

    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
  });

  it("returns 201 for a message of exactly 10 characters", async () => {
    const env = createMockEnv();
    const req = makeContactRequest({
      name: "Bob",
      email: "bob@example.com",
      message: "1234567890",
    });

    const res = await contactHandler(req, env);
    expect(res.status).toBe(201);
  });

  it("returns 201 for a very long message", async () => {
    const env = createMockEnv();
    const req = makeContactRequest({
      name: "Carol",
      email: "carol@example.com",
      message: "A".repeat(5000),
    });
    const res = await contactHandler(req, env);
    expect(res.status).toBe(201);
  });

  // ── 400 Validation errors ───────────────────────────────────────────────────

  it("returns 400 when message is shorter than 10 characters", async () => {
    const env = createMockEnv();
    const req = makeContactRequest({
      name: "Alice",
      email: "alice@example.com",
      message: "short",
    });

    const res = await contactHandler(req, env);
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.error).toBeDefined();
  });

  it("returns 400 when name field is missing", async () => {
    const env = createMockEnv();
    const req = makeContactRequest({
      email: "alice@example.com",
      message: "Valid message here",
    });

    const res = await contactHandler(req, env);
    expect(res.status).toBe(400);
  });

  it("returns 400 when email field is missing", async () => {
    const env = createMockEnv();
    const req = makeContactRequest({ name: "Alice", message: "Valid message here" });

    const res = await contactHandler(req, env);
    expect(res.status).toBe(400);
  });

  it("returns 400 when message field is missing", async () => {
    const env = createMockEnv();
    const req = makeContactRequest({ name: "Alice", email: "alice@example.com" });

    const res = await contactHandler(req, env);
    expect(res.status).toBe(400);
  });

  it("returns 400 when body is an empty object", async () => {
    const env = createMockEnv();
    const req = makeContactRequest({});

    const res = await contactHandler(req, env);
    expect(res.status).toBe(400);
  });

  // ── 400 Malformed JSON ───────────────────────────────────────────────────────

  it("returns 400 for non-JSON body", async () => {
    const env = createMockEnv();
    const req = new Request("http://example.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "this is not json {",
    });

    const res = await contactHandler(req, env);
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.error).toBeDefined();
  });

  it("returns 400 for completely empty body", async () => {
    const env = createMockEnv();
    const req = new Request("http://example.com/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "",
    });

    const res = await contactHandler(req, env);
    expect(res.status).toBe(400);
  });

  // ── Response shape ─────────────────────────────────────────────────────────

  it("response body has Content-Type application/json", async () => {
    const env = createMockEnv();
    const req = makeContactRequest({
      name: "Alice",
      email: "alice@example.com",
      message: "A valid message here!",
    });

    const res = await contactHandler(req, env);
    expect(res.headers.get("Content-Type")).toBe("application/json");
  });

  // ── KV storage unavailable ─────────────────────────────────────────────────

  it("returns 400 when MESSAGES_KV is not configured", async () => {
    const env = createEnvWithoutKV();
    const req = makeContactRequest({
      name: "Alice",
      email: "alice@example.com",
      message: "A valid message here!",
    });

    const res = await contactHandler(req, env);
    expect(res.status).toBe(400);
  });
});
