import getAddress, { faucetAddress, imgUrl } from "../getAddress";

describe("getAddress", () => {
  test("returns address for valid input", () => {
    const result = getAddress("test");
    expect(result).toBe("test...test");
  });

  test("returns empty string for null or undefined", () => {
    expect(getAddress(null)).toBe("undefined...undefined");
    expect(getAddress(undefined)).toBe("...");
  });

  test("handles empty string", () => {
    const result = getAddress("");
    expect(result).toBe("...");
  });

  test("handles N/A", () => {
    const result = getAddress("N/A");
    expect(result).toBe("N/A...N/A");
  });

  test("handles short address", () => {
    const result = getAddress("abc");
    expect(result).toBe("abc...abc");
  });

  test("handles custom lengths", () => {
    const result = getAddress("longaddresshere", 5, 5);
    expect(result).toBe("longa...shere");
  });
});

describe("faucetAddress", () => {
  test("handles null", () => {
    const result = faucetAddress(null);
    expect(result).toBe("undefined...undefined");
  });

  test("handles undefined", () => {
    const result = faucetAddress(undefined);
    expect(result).toBe("...");
  });

  test("handles empty string", () => {
    const result = faucetAddress("");
    expect(result).toBe("...");
  });

  test("handles N/A", () => {
    const result = faucetAddress("N/A");
    expect(result).toBe("N/A...N/A");
  });

  test("handles short address", () => {
    const result = faucetAddress("short");
    expect(result).toBe("short...short");
  });

  test("handles custom lengths", () => {
    const result = faucetAddress(
      "0x1234567890abcdef1234567890abcdef12345678",
      10,
      10
    );
    expect(result).toBe("0x12345678...ef12345678");
  });
});

describe("imgUrl", () => {
  test("returns address for valid input", () => {
    const result = imgUrl("0x1234567890abcdef1234567890abcdef12345678");
    expect(result).toBe("0x12345678...ef12345678");
  });

  test("handles null", () => {
    const result = imgUrl(null);
    expect(result).toBe("undefined...undefined");
  });

  test("handles undefined", () => {
    const result = imgUrl(undefined);
    expect(result).toBe("...");
  });

  test("handles empty string", () => {
    const result = imgUrl("");
    expect(result).toBe("...");
  });

  test("handles N/A", () => {
    const result = imgUrl("N/A");
    expect(result).toBe("N/A...N/A");
  });

  test("handles short address", () => {
    const result = imgUrl("short");
    expect(result).toBe("short...short");
  });

  test("handles custom lengths", () => {
    const result = imgUrl("0x1234567890abcdef1234567890abcdef12345678", 8, 8);
    expect(result).toBe("0x123456...12345678");
  });
});
