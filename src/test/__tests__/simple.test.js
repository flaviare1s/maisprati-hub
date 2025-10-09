import { describe, it, expect } from "vitest";

describe("Simple Test", () => {
  it("should work with expect", () => {
    expect(true).toBe(true);
  });

  it("should do basic math", () => {
    expect(2 + 2).toBe(4);
  });
});
