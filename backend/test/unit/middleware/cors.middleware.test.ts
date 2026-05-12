import { describe, it, expect } from "vitest";
import { applyCors } from "../../../src/middleware/cors.middleware";
import { createMockEnv } from "../../helpers/mock-env";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeResponse(
  body = "ok",
  status = 200,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(body, { status, headers: extraHeaders });
}

// ── CORS origin ───────────────────────────────────────────────────────────────

describe("applyCors – origin header", () => {
  it("uses FRONTEND_URL from env as Allow-Origin", () => {
    const env = createMockEnv({ FRONTEND_URL: "https://mysite.example" });
    const res = applyCors(makeResponse(), env);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://mysite.example"
    );
  });

  it("falls back to '*' when env is not provided", () => {
    const res = applyCors(makeResponse());
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("falls back to '*' when FRONTEND_URL is empty", () => {
    const env = createMockEnv({ FRONTEND_URL: "" });
    const res = applyCors(makeResponse(), env);
    // empty string is falsy → fallback to *
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

// ── CORS other headers ────────────────────────────────────────────────────────

describe("applyCors – CORS method/header exposure", () => {
  it("sets Access-Control-Allow-Methods", () => {
    const res = applyCors(makeResponse());
    const methods = res.headers.get("Access-Control-Allow-Methods") ?? "";
    expect(methods).toContain("GET");
    expect(methods).toContain("POST");
    expect(methods).toContain("OPTIONS");
  });

  it("sets Access-Control-Allow-Headers to include Content-Type and Authorization", () => {
    const res = applyCors(makeResponse());
    const hdrs = res.headers.get("Access-Control-Allow-Headers") ?? "";
    expect(hdrs).toContain("Content-Type");
    expect(hdrs).toContain("Authorization");
  });

  it("sets a positive Access-Control-Max-Age", () => {
    const res = applyCors(makeResponse());
    const age = Number(res.headers.get("Access-Control-Max-Age"));
    expect(age).toBeGreaterThan(0);
  });
});

// ── Security headers ─────────────────────────────────────────────────────────

describe("applyCors – security headers", () => {
  it("sets X-Content-Type-Options to nosniff", () => {
    const res = applyCors(makeResponse());
    expect(res.headers.get("X-Content-Type-Options")).toBe("nosniff");
  });

  it("sets X-Frame-Options to DENY", () => {
    const res = applyCors(makeResponse());
    expect(res.headers.get("X-Frame-Options")).toBe("DENY");
  });

  it("sets X-XSS-Protection", () => {
    const res = applyCors(makeResponse());
    const xss = res.headers.get("X-XSS-Protection") ?? "";
    expect(xss).toContain("1");
  });

  it("sets Referrer-Policy", () => {
    const res = applyCors(makeResponse());
    expect(res.headers.get("Referrer-Policy")).toBeTruthy();
  });

  it("sets Strict-Transport-Security with a max-age", () => {
    const res = applyCors(makeResponse());
    const hsts = res.headers.get("Strict-Transport-Security") ?? "";
    expect(hsts).toContain("max-age=");
  });
});

// ── Response passthrough ──────────────────────────────────────────────────────

describe("applyCors – preserves response properties", () => {
  it("preserves the original status code", () => {
    const res = applyCors(makeResponse("", 201));
    expect(res.status).toBe(201);
  });

  it("preserves a 4xx status code", () => {
    const res = applyCors(makeResponse("", 400));
    expect(res.status).toBe(400);
  });

  it("preserves original response body", async () => {
    const res = applyCors(makeResponse("hello world"));
    expect(await res.text()).toBe("hello world");
  });

  it("preserves pre-existing response headers", () => {
    const inner = makeResponse("", 200, { "X-Custom": "my-value" });
    const res = applyCors(inner);
    expect(res.headers.get("X-Custom")).toBe("my-value");
  });
});
