import { describe, it, expect } from "vitest";
import { jsonResponse, parseJson, errorResponse } from "../../../src/utils/response";
import { UnauthorizedError } from "../../../src/utils/errors";

describe("jsonResponse", () => {
  it("defaults to status 200", async () => {
    const res = jsonResponse({ ok: true });
    expect(res.status).toBe(200);
  });

  it("uses the provided status code", async () => {
    const res = jsonResponse({ created: true }, 201);
    expect(res.status).toBe(201);
  });

  it("sets Content-Type to application/json", () => {
    const res = jsonResponse({});
    expect(res.headers.get("Content-Type")).toBe("application/json");
  });

  it("serialises the body to JSON", async () => {
    const payload = { name: "Alice", score: 42 };
    const res = jsonResponse(payload);
    const body = await res.json();
    expect(body).toEqual(payload);
  });

  it("handles an empty object", async () => {
    const res = jsonResponse({});
    const body = await res.json();
    expect(body).toEqual({});
  });

  it("handles arrays", async () => {
    const res = jsonResponse([1, 2, 3]);
    const body = await res.json();
    expect(body).toEqual([1, 2, 3]);
  });

  it("handles null payload", async () => {
    const res = jsonResponse(null);
    const body = await res.json();
    expect(body).toBeNull();
  });

  it("handles 4xx status codes", async () => {
    const res = jsonResponse({ error: "bad" }, 400);
    expect(res.status).toBe(400);
  });

  it("handles 5xx status codes", async () => {
    const res = jsonResponse({ error: "server" }, 500);
    expect(res.status).toBe(500);
  });
});

describe("parseJson", () => {
  it("returns parsed object from valid JSON body", async () => {
    const req = new Request("http://test.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hello: "world" }),
    });
    const result = await parseJson(req);
    expect(result).toEqual({ hello: "world" });
  });

  it("returns parsed array from valid JSON body", async () => {
    const req = new Request("http://test.com", {
      method: "POST",
      body: JSON.stringify([1, 2, 3]),
    });
    const result = await parseJson(req);
    expect(result).toEqual([1, 2, 3]);
  });

  it("throws on malformed JSON", async () => {
    const req = new Request("http://test.com", {
      method: "POST",
      body: "not json {",
    });
    await expect(parseJson(req)).rejects.toThrow("Invalid JSON body");
  });

  it("throws on empty body", async () => {
    const req = new Request("http://test.com", { method: "POST", body: "" });
    await expect(parseJson(req)).rejects.toThrow("Invalid JSON body");
  });

  it("returns null for a JSON null body", async () => {
    const req = new Request("http://test.com", {
      method: "POST",
      body: "null",
    });
    const result = await parseJson(req);
    expect(result).toBeNull();
  });
});

describe("errorResponse", () => {
  it("returns status 400 for a generic Error", async () => {
    const res = errorResponse(new Error("something failed"));
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.error).toBe("something failed");
  });

  it("returns status 401 for an UnauthorizedError", async () => {
    const res = errorResponse(new UnauthorizedError("token missing"));
    expect(res.status).toBe(401);
    const body = (await res.json()) as any;
    expect(body.error).toBe("token missing");
  });

  it("returns status 400 for an unknown thrown value", async () => {
    const res = errorResponse("some string error");
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.error).toBe("Unknown error");
  });

  it("returns status 400 for null", async () => {
    const res = errorResponse(null);
    expect(res.status).toBe(400);
    const body = (await res.json()) as any;
    expect(body.error).toBe("Unknown error");
  });

  it("always includes an error key in the response body", async () => {
    const res = errorResponse(new Error("oops"));
    const body = (await res.json()) as any;
    expect(body).toHaveProperty("error");
  });

  it("sets Content-Type to application/json", () => {
    const res = errorResponse(new Error("x"));
    expect(res.headers.get("Content-Type")).toBe("application/json");
  });
});
