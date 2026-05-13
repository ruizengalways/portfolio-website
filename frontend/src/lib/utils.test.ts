import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    const condition1 = true;
    const condition2 = false;
    expect(cn("class1", condition1 && "class2", condition2 && "class3")).toBe(
      "class1 class2",
    );
  });

  it("should merge Tailwind classes with twMerge", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toContain("px-4");
    expect(result).toContain("py-1");
    expect(result).not.toContain("px-2");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("", "class1")).toBe("class1");
  });

  it("should handle arrays and objects", () => {
    expect(cn(["class1", "class2"])).toBe("class1 class2");
    expect(cn({ class1: true, class2: false })).toBe("class1");
  });

  it("should handle mixed inputs", () => {
    expect(cn("class1", ["class2", "class3"], { class4: true })).toBe(
      "class1 class2 class3 class4",
    );
  });
});
