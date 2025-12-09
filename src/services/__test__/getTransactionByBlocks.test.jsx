// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

// Mock localStorage globally BEFORE import
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(),
  },
  writable: true,
});

import getTransactionByBlocks from "../getTransactionByBlocks";
const mockConstants = require("@/constant/constant");

describe("getTransactionByBlocks", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should call EVM API when chainType is 'EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockResponse = { transactions: [{ hash: "0xabc123" }] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionByBlocks(123, 1, 10);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}transactions/get-transaction-by-block?value=123&page=1&limit=10`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call Native API when chainType is not 'EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "Native Chain");

    const mockResponse = { transactions: [{ hash: "0xdef456" }] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionByBlocks(456, 2, 20);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}transactions/block?value=456&page=2&limit=20`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch throws", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getTransactionByBlocks(789, 1, 10);

    expect(result).toBe(mockError);
  });

  it("should default to Native API if localStorage returns null (window undefined)", async () => {
    global.localStorage.getItem = jest.fn(() => null);

    const mockResponse = { transactions: [{ hash: "0xabc123" }] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionByBlocks(123, 1, 10);

    // In the test environment `window` is undefined, so the code takes the
    // Native API branch when `localStorage.getItem` is not evaluated. Expect
    // the Native API URL here.
    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}transactions/block?value=123&page=1&limit=10`
    );
    expect(result).toEqual(mockResponse);
  });
});
