// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
  tableLimit: 10,
}));

// Mock localStorage globally BEFORE import
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(),
  },
  writable: true,
});

import getTransactionsByAddress from "../getTransactionByAddress";
const mockConstants = require("@/constant/constant");

describe("getTransactionsByAddress", () => {
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

    const result = await getTransactionsByAddress("0xabc", 1);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}transactions/get-transaction-by-address?address=0xabc&page=1&limit=${mockConstants.tableLimit}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call Native API when chainType is not 'EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "Native Chain");

    const mockResponse = { transactions: [{ hash: "0xdef456" }] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionsByAddress("0xdef", 2);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}transactions/address?address=0xdef&page=2&limit=${mockConstants.tableLimit}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch throws", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getTransactionsByAddress("0xerror", 1);

    expect(result).toBe(mockError);
  });

  it("should default to Native API if localStorage returns null (window undefined)", async () => {
    global.localStorage.getItem = jest.fn(() => null);

    const mockResponse = { transactions: [{ hash: "0xabc123" }] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionsByAddress("0xabc", 1);

    // When `window` is undefined in the test environment, the code evaluates
    // `typeof window !== "undefined" && localStorage.getItem("chainType")` to
    // `false`, so the Native API branch is taken. Expect that behaviour here.
    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}transactions/address?address=0xabc&page=1&limit=${mockConstants.tableLimit}`
    );
    expect(result).toEqual(mockResponse);
  });
});
