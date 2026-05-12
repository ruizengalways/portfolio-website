import { describe, it, expect } from "vitest";
import {
  adminListMessagesHandler,
  adminDeleteMessageHandler,
  adminStatsHandler,
} from "../../../src/handlers/admin.handler";
import { createMockEnv } from "../../helpers/mock-env";

// ── Helpers ───────────────────────────────────────────────────────────────────

const VALID_TOKEN = "test-admin-key-123";

function authedRequest(method = "GET", path = "/admin/messages"): Request {
  return new Request(`http://example.com${path}`, {
    method,
    headers: { Authorization: `Bearer ${VALID_TOKEN}` },
  });
}

function unauthRequest(method = "GET", path = "/admin/messages"): Request {
  return new Request(`http://example.com${path}`, { method });
}

// ── adminListMessagesHandler ──────────────────────────────────────────────────

describe("adminListMessagesHandler", () => {
  // ── Authenticated ──────────────────────────────────────────────────────────

  it("returns 200 with valid Bearer token", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminListMessagesHandler(authedRequest(), env);
    expect(res.status).toBe(200);
  });

  it("returns success:true in the body", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminListMessagesHandler(authedRequest(), env);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
  });

  it("returns a messages array in the body", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminListMessagesHandler(authedRequest(), env);
    const body = (await res.json()) as any;
    expect(Array.isArray(body.messages)).toBe(true);
  });

  it("returns a count matching the messages array length", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminListMessagesHandler(authedRequest(), env);
    const body = (await res.json()) as any;
    expect(body.count).toBe(body.messages.length);
  });

  it("returns Content-Type application/json", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminListMessagesHandler(authedRequest(), env);
    expect(res.headers.get("Content-Type")).toBe("application/json");
  });

  // ── Unauthenticated ────────────────────────────────────────────────────────

  it("returns 401 when Authorization header is missing", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminListMessagesHandler(unauthRequest(), env);
    expect(res.status).toBe(401);
  });

  it("returns 401 for a wrong Bearer token", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const req = new Request("http://example.com/admin/messages", {
      headers: { Authorization: "Bearer wrong-token" },
    });
    const res = await adminListMessagesHandler(req, env);
    expect(res.status).toBe(401);
  });

  it("returns 401 for a non-Bearer scheme", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const req = new Request("http://example.com/admin/messages", {
      headers: { Authorization: "Basic dXNlcjpwYXNz" },
    });
    const res = await adminListMessagesHandler(req, env);
    expect(res.status).toBe(401);
  });

  it("401 body includes an error key", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminListMessagesHandler(unauthRequest(), env);
    const body = (await res.json()) as any;
    expect(body.error).toBeDefined();
  });
});

// ── adminDeleteMessageHandler ─────────────────────────────────────────────────

describe("adminDeleteMessageHandler", () => {
  it("returns 200 when authenticated and messageId is provided", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminDeleteMessageHandler(
      authedRequest("DELETE", "/admin/messages/msg-abc"),
      env,
      "msg-abc"
    );
    expect(res.status).toBe(200);
  });

  it("returns success:true in the body", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminDeleteMessageHandler(
      authedRequest("DELETE"),
      env,
      "msg-xyz"
    );
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
  });

  it("includes the messageId in the response message", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminDeleteMessageHandler(
      authedRequest("DELETE"),
      env,
      "msg-abc-123"
    );
    const body = (await res.json()) as any;
    expect(body.message).toContain("msg-abc-123");
  });

  it("returns 401 when not authenticated", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminDeleteMessageHandler(
      unauthRequest("DELETE"),
      env,
      "msg-abc"
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 when messageId is empty string", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminDeleteMessageHandler(
      authedRequest("DELETE"),
      env,
      ""
    );
    expect(res.status).toBe(400);
  });
});

// ── adminStatsHandler ─────────────────────────────────────────────────────────

describe("adminStatsHandler", () => {
  it("returns 200 when authenticated", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminStatsHandler(authedRequest("GET", "/admin/stats"), env);
    expect(res.status).toBe(200);
  });

  it("returns success:true in the body", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminStatsHandler(authedRequest(), env);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
  });

  it("returns a stats object with numeric fields", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminStatsHandler(authedRequest(), env);
    const body = (await res.json()) as any;
    expect(typeof body.stats.totalMessages).toBe("number");
    expect(typeof body.stats.totalVisits).toBe("number");
  });

  it("returns a lastUpdated timestamp in the stats", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminStatsHandler(authedRequest(), env);
    const body = (await res.json()) as any;
    expect(body.stats.lastUpdated).toBeDefined();
  });

  it("returns 401 when not authenticated", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const res = await adminStatsHandler(unauthRequest(), env);
    expect(res.status).toBe(401);
  });

  it("returns 401 for a wrong token", async () => {
    const env = createMockEnv({ ADMIN_API_KEY: VALID_TOKEN });
    const req = new Request("http://example.com/admin/stats", {
      headers: { Authorization: "Bearer bad-key" },
    });
    const res = await adminStatsHandler(req, env);
    expect(res.status).toBe(401);
  });
});
