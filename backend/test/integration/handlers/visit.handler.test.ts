import { describe, it, expect } from "vitest";
import { visitHandler } from "../../../src/handlers/visit.handler";
import { createMockEnv, createEnvWithoutKV } from "../../helpers/mock-env";

// ── Helpers ───────────────────────────────────────────────────────────────────

function postVisitRequest(): Request {
  return new Request("http://example.com/visit", { method: "POST" });
}

function getVisitRequest(): Request {
  return new Request("http://example.com/visit", { method: "GET" });
}

// ── visitHandler integration ──────────────────────────────────────────────────

describe("visitHandler – POST /visit", () => {
  it("returns 201 on a successful visit record", async () => {
    const env = createMockEnv();
    const res = await visitHandler(postVisitRequest(), env);
    expect(res.status).toBe(201);
  });

  it("returns success:true in the body", async () => {
    const env = createMockEnv();
    const res = await visitHandler(postVisitRequest(), env);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
  });

  it("includes a stats object in the body", async () => {
    const env = createMockEnv();
    const res = await visitHandler(postVisitRequest(), env);
    const body = (await res.json()) as any;
    expect(body.stats).toBeDefined();
    expect(typeof body.stats.totalVisits).toBe("number");
    expect(typeof body.stats.totalMessages).toBe("number");
  });

  it("increments totalVisits with each POST", async () => {
    const env = createMockEnv();

    const res1 = await visitHandler(postVisitRequest(), env);
    const body1 = (await res1.json()) as any;
    const visits1 = body1.stats.totalVisits;

    const res2 = await visitHandler(postVisitRequest(), env);
    const body2 = (await res2.json()) as any;
    const visits2 = body2.stats.totalVisits;

    expect(visits2).toBe(visits1 + 1);
  });

  it("returns Content-Type application/json", async () => {
    const env = createMockEnv();
    const res = await visitHandler(postVisitRequest(), env);
    expect(res.headers.get("Content-Type")).toBe("application/json");
  });

  it("returns 400 when MESSAGES_KV is not configured", async () => {
    // recordVisit throws when the binding is missing; handler catches and returns 400
    const env = createEnvWithoutKV();
    const res = await visitHandler(postVisitRequest(), env);
    expect(res.status).toBe(400);
  });
});

describe("visitHandler – GET /visit", () => {
  it("returns 200 for a GET request", async () => {
    const env = createMockEnv();
    const res = await visitHandler(getVisitRequest(), env);
    expect(res.status).toBe(200);
  });

  it("returns stats with numeric counters", async () => {
    const env = createMockEnv();
    const res = await visitHandler(getVisitRequest(), env);
    const body = (await res.json()) as any;
    expect(typeof body.totalVisits).toBe("number");
    expect(typeof body.totalMessages).toBe("number");
  });

  it("reflects visits recorded via POST", async () => {
    const env = createMockEnv();

    // Record two visits
    await visitHandler(postVisitRequest(), env);
    await visitHandler(postVisitRequest(), env);

    const res = await visitHandler(getVisitRequest(), env);
    const body = (await res.json()) as any;
    expect(body.totalVisits).toBeGreaterThanOrEqual(2);
  });

  it("returns Content-Type application/json", async () => {
    const env = createMockEnv();
    const res = await visitHandler(getVisitRequest(), env);
    expect(res.headers.get("Content-Type")).toBe("application/json");
  });
});

describe("visitHandler – unsupported methods", () => {
  it("returns 405 for PUT", async () => {
    const env = createMockEnv();
    const req = new Request("http://example.com/visit", { method: "PUT" });
    const res = await visitHandler(req, env);
    expect(res.status).toBe(405);
  });

  it("returns 405 for DELETE", async () => {
    const env = createMockEnv();
    const req = new Request("http://example.com/visit", { method: "DELETE" });
    const res = await visitHandler(req, env);
    expect(res.status).toBe(405);
  });

  it("returns 405 for PATCH", async () => {
    const env = createMockEnv();
    const req = new Request("http://example.com/visit", { method: "PATCH" });
    const res = await visitHandler(req, env);
    expect(res.status).toBe(405);
  });
});
