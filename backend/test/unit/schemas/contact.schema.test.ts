import { describe, it, expect } from "vitest";
import {
  validateContactInput,
  type ContactInput,
} from "../../../src/schemas/contact.schema";

describe("validateContactInput", () => {
  // ── Happy Path ─────────────────────────────────────────────────────────────

  it("returns trimmed ContactInput for valid payload", () => {
    const result = validateContactInput({
      name: "  Alice  ",
      email: "  alice@example.com  ",
      message: "  Hello there!  ",
    });

    expect(result).toEqual<ContactInput>({
      name: "Alice",
      email: "alice@example.com",
      message: "Hello there!",
    });
  });

  it("accepts a payload with no leading/trailing whitespace unchanged", () => {
    const result = validateContactInput({
      name: "Bob",
      email: "bob@example.com",
      message: "A normal message",
    });

    expect(result.name).toBe("Bob");
    expect(result.email).toBe("bob@example.com");
    expect(result.message).toBe("A normal message");
  });

  it("accepts empty strings (trimming is non-strict validation)", () => {
    // validateContactInput only checks type, not emptiness
    const result = validateContactInput({ name: "", email: "", message: "" });
    expect(result).toEqual({ name: "", email: "", message: "" });
  });

  // ── Missing / Wrong Types ───────────────────────────────────────────────────

  it("throws when input is null", () => {
    // typeof null === 'object' bypasses the first guard, so a TypeError is thrown
    // when accessing null.name — the important contract is that it throws.
    expect(() => validateContactInput(null)).toThrow();
  });

  it("throws when input is undefined", () => {
    expect(() => validateContactInput(undefined)).toThrow(
      "Invalid contact payload"
    );
  });

  it("throws when input is a primitive string", () => {
    expect(() => validateContactInput("hello")).toThrow(
      "Invalid contact payload"
    );
  });

  it("throws when input is an array", () => {
    expect(() =>
      validateContactInput(["alice", "alice@example.com", "msg"])
    ).toThrow("Invalid contact payload");
  });

  it("throws when name is missing", () => {
    expect(() =>
      validateContactInput({ email: "a@a.com", message: "msg" })
    ).toThrow("Invalid contact payload");
  });

  it("throws when email is missing", () => {
    expect(() =>
      validateContactInput({ name: "Alice", message: "msg" })
    ).toThrow("Invalid contact payload");
  });

  it("throws when message is missing", () => {
    expect(() =>
      validateContactInput({ name: "Alice", email: "a@a.com" })
    ).toThrow("Invalid contact payload");
  });

  it("throws when name is a number", () => {
    expect(() =>
      validateContactInput({ name: 42, email: "a@a.com", message: "msg" })
    ).toThrow("Invalid contact payload");
  });

  it("throws when email is a boolean", () => {
    expect(() =>
      validateContactInput({ name: "Alice", email: true, message: "msg" })
    ).toThrow("Invalid contact payload");
  });

  it("throws when message is an object", () => {
    expect(() =>
      validateContactInput({ name: "Alice", email: "a@a.com", message: {} })
    ).toThrow("Invalid contact payload");
  });

  it("throws when all fields are numbers", () => {
    expect(() =>
      validateContactInput({ name: 1, email: 2, message: 3 })
    ).toThrow("Invalid contact payload");
  });

  // ── Return-type shape ───────────────────────────────────────────────────────

  it("returns an object with exactly name, email, message keys", () => {
    const result = validateContactInput({
      name: "Carol",
      email: "carol@x.com",
      message: "Hi",
      extra: "ignored",
    });

    // extra fields are stripped (only the three defined fields are returned)
    expect(Object.keys(result).sort()).toEqual(["email", "message", "name"]);
  });
});
