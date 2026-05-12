import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logRequest } from "../../../src/middleware/logger.middleware";

describe("logRequest", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("calls console.log once per request", () => {
    logRequest(new Request("http://example.com/health"));
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });

  it("includes the HTTP method in the log output", () => {
    logRequest(
      new Request("http://example.com/contact", { method: "POST" })
    );
    const logged = consoleSpy.mock.calls[0][0] as string;
    expect(logged).toContain("POST");
  });

  it("includes the full request URL in the log output", () => {
    logRequest(new Request("http://example.com/health?check=1"));
    const logged = consoleSpy.mock.calls[0][0] as string;
    expect(logged).toContain("http://example.com/health?check=1");
  });

  it("includes an ISO-8601 timestamp in the log output", () => {
    logRequest(new Request("http://example.com/"));
    const logged = consoleSpy.mock.calls[0][0] as string;
    // Matches [2026-04-29T10:00:00.000Z] format
    expect(logged).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it("logs GET method correctly", () => {
    logRequest(new Request("http://example.com/visit", { method: "GET" }));
    const logged = consoleSpy.mock.calls[0][0] as string;
    expect(logged).toContain("GET");
  });

  it("logs DELETE method correctly", () => {
    logRequest(
      new Request("http://example.com/admin/messages/1", { method: "DELETE" })
    );
    const logged = consoleSpy.mock.calls[0][0] as string;
    expect(logged).toContain("DELETE");
  });

  it("does not throw for any valid Request", () => {
    expect(() =>
      logRequest(new Request("http://test.com/", { method: "OPTIONS" }))
    ).not.toThrow();
  });
});
