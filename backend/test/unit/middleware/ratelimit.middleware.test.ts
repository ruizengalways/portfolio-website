import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  checkRateLimit,
  getClientIp,
} from "../../../src/middleware/ratelimit.middleware";
import { createMockKV } from "../../helpers/mock-kv";

// ── getClientIp ───────────────────────────────────────────────────────────────

describe("getClientIp", () => {
  it("returns CF-Connecting-IP when present", () => {
    const req = new Request("http://example.com", {
      headers: { "CF-Connecting-IP": "1.2.3.4" },
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("prefers CF-Connecting-IP over X-Forwarded-For", () => {
    const req = new Request("http://example.com", {
      headers: {
        "CF-Connecting-IP": "1.2.3.4",
        "X-Forwarded-For": "9.9.9.9",
      },
    });
    expect(getClientIp(req)).toBe("1.2.3.4");
  });

  it("falls back to X-Forwarded-For when CF-Connecting-IP is absent", () => {
    const req = new Request("http://example.com", {
      headers: { "X-Forwarded-For": "5.6.7.8, 10.0.0.1" },
    });
    // Takes the first (leftmost) IP
    expect(getClientIp(req)).toBe("5.6.7.8");
  });

  it("trims whitespace from X-Forwarded-For", () => {
    const req = new Request("http://example.com", {
      headers: { "X-Forwarded-For": "  5.6.7.8  , 10.0.0.1" },
    });
    expect(getClientIp(req)).toBe("5.6.7.8");
  });

  it("returns 'unknown' when no IP headers are present", () => {
    const req = new Request("http://example.com");
    expect(getClientIp(req)).toBe("unknown");
  });
});

// ── checkRateLimit ────────────────────────────────────────────────────────────

describe("checkRateLimit", () => {
  it("allows all requests when KV is undefined (dev mode)", async () => {
    const result = await checkRateLimit(undefined, "1.2.3.4", "/contact");
    expect(result).toBe(true);
  });

  it("allows the first request from a new IP", async () => {
    const kv = createMockKV();
    const allowed = await checkRateLimit(kv, "10.0.0.1", "/contact");
    expect(allowed).toBe(true);
  });

  it("stores a rate-limit entry in KV on first request", async () => {
    const kv = createMockKV();
    await checkRateLimit(kv, "10.0.0.2", "/contact");
    expect(kv.put).toHaveBeenCalledOnce();
  });

  it("allows requests within the limit window", async () => {
    const kv = createMockKV();
    const ip = "10.0.0.3";

    // First 10 requests should all be allowed
    for (let i = 0; i < 10; i++) {
      const result = await checkRateLimit(kv, ip, "/contact");
      expect(result).toBe(true);
    }
  });

  it("blocks the 11th request in the same window", async () => {
    const kv = createMockKV();
    const ip = "10.0.0.4";

    for (let i = 0; i < 10; i++) {
      await checkRateLimit(kv, ip, "/contact");
    }
    const blocked = await checkRateLimit(kv, ip, "/contact");
    expect(blocked).toBe(false);
  });

  it("resets counter after window expiry", async () => {
    const kv = createMockKV();
    const ip = "10.0.0.5";

    // Exhaust the limit
    for (let i = 0; i < 10; i++) {
      await checkRateLimit(kv, ip, "/contact");
    }

    // Manually insert an expired entry into KV
    const key = `ratelimit:${ip}:/contact`;
    await kv.put(
      key,
      JSON.stringify({ requests: 10, resetTime: Date.now() - 1 })
    );

    // Should be allowed again after window reset
    const allowed = await checkRateLimit(kv, ip, "/contact");
    expect(allowed).toBe(true);
  });

  it("allows requests when KV throws (fail-open policy)", async () => {
    const kv = createMockKV();
    // Override get to throw
    (kv.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("KV timeout")
    );

    const result = await checkRateLimit(kv, "10.0.0.6", "/contact");
    expect(result).toBe(true);
  });

  it("tracks different IPs independently", async () => {
    const kv = createMockKV();

    // Exhaust IP A
    for (let i = 0; i < 10; i++) {
      await checkRateLimit(kv, "192.168.0.1", "/contact");
    }
    const blockedA = await checkRateLimit(kv, "192.168.0.1", "/contact");
    expect(blockedA).toBe(false);

    // IP B should still be allowed
    const allowedB = await checkRateLimit(kv, "192.168.0.2", "/contact");
    expect(allowedB).toBe(true);
  });

  it("tracks different endpoints independently per IP", async () => {
    const kv = createMockKV();
    const ip = "10.0.0.7";

    // Exhaust /contact
    for (let i = 0; i < 10; i++) {
      await checkRateLimit(kv, ip, "/contact");
    }
    const blockedContact = await checkRateLimit(kv, ip, "/contact");
    expect(blockedContact).toBe(false);

    // /visit should be a separate bucket
    const allowedVisit = await checkRateLimit(kv, ip, "/visit");
    expect(allowedVisit).toBe(true);
  });
});
