import { describe, expect, it } from "vitest";
import { validateLogin } from "../utils/validation";

describe("validateLogin", () => {
  it("returns an error for empty email", () => {
    const errors = validateLogin("", "password123");
    expect(errors.email).toBeDefined();
  });

  it("returns an error for short password", () => {
    const errors = validateLogin("test@dal.ca", "abc");
    expect(errors.password).toBeDefined();
  });

  it("returns no errors for valid input", () => {
    const errors = validateLogin("test@dal.ca", "password123");
    expect(Object.keys(errors)).toHaveLength(0);
  });
});