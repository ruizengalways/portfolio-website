import { describe, it, expect } from "vitest";
import { ValidationError, UnauthorizedError } from "../../../src/utils/errors";

describe("ValidationError", () => {
  it("is an instance of Error", () => {
    const err = new ValidationError("bad input");
    expect(err).toBeInstanceOf(Error);
  });

  it("is an instance of ValidationError", () => {
    const err = new ValidationError("bad input");
    expect(err).toBeInstanceOf(ValidationError);
  });

  it("stores the message correctly", () => {
    const err = new ValidationError("field is required");
    expect(err.message).toBe("field is required");
  });

  it("has the correct constructor name", () => {
    const err = new ValidationError("x");
    expect(err.constructor.name).toBe("ValidationError");
  });

  it("can be caught as a generic Error", () => {
    expect(() => {
      throw new ValidationError("test");
    }).toThrow(Error);
  });

  it("can be differentiated from UnauthorizedError", () => {
    const err = new ValidationError("x");
    expect(err).not.toBeInstanceOf(UnauthorizedError);
  });
});

describe("UnauthorizedError", () => {
  it("is an instance of Error", () => {
    const err = new UnauthorizedError("not allowed");
    expect(err).toBeInstanceOf(Error);
  });

  it("is an instance of UnauthorizedError", () => {
    const err = new UnauthorizedError("not allowed");
    expect(err).toBeInstanceOf(UnauthorizedError);
  });

  it("stores the message correctly", () => {
    const err = new UnauthorizedError("token expired");
    expect(err.message).toBe("token expired");
  });

  it("has the correct constructor name", () => {
    const err = new UnauthorizedError("x");
    expect(err.constructor.name).toBe("UnauthorizedError");
  });

  it("can be caught as a generic Error", () => {
    expect(() => {
      throw new UnauthorizedError("401");
    }).toThrow(Error);
  });

  it("can be differentiated from ValidationError", () => {
    const err = new UnauthorizedError("x");
    expect(err).not.toBeInstanceOf(ValidationError);
  });
});
