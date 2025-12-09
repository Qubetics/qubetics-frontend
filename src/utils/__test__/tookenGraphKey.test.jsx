import isOptionDisable from "../tookenGraphKey";

// Freeze current date for predictable testing
const mockCurrentDate = new Date("2025-01-10T12:00:00Z");

describe("isOptionDisable", () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(mockCurrentDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("returns true when current date is before expiration date", () => {
    const activationDate = "2025-01-01T12:00:00Z";
    const validityPeriod = 15; // Expires Jan 16, 2025

    expect(isOptionDisable(activationDate, validityPeriod)).toBe(true);
  });

  test("returns true when current date is exactly the expiration date", () => {
    const activationDate = "2025-01-05T12:00:00Z";
    const validityPeriod = 5; // Expires Jan 10, 2025

    expect(isOptionDisable(activationDate, validityPeriod)).toBe(true);
  });

  test("returns false when current date is after expiration date", () => {
    const activationDate = "2024-12-20T12:00:00Z";
    const validityPeriod = 10; // Expires Dec 30, 2024

    expect(isOptionDisable(activationDate, validityPeriod)).toBe(false);
  });

  test("works with date in number (timestamp)", () => {
    const activationDate = new Date("2025-01-01").getTime();
    const validityPeriod = 3; // Expires Jan 4, 2025

    expect(isOptionDisable(activationDate, validityPeriod)).toBe(false);
  });

  test("handles invalid date input", () => {
    const activationDate = "invalid-date";
    const validityPeriod = 5;

    // Invalid date becomes "Invalid Date" → expirationDate = NaN → comparison fails
    expect(isOptionDisable(activationDate, validityPeriod)).toBe(false);
  });
});
