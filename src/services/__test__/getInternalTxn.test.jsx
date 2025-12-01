// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
}));

import getInternalTxns, { getInternalTxnsByHash } from "../getInternalTxn";
const mockConstants = require("@/constant/constant");

describe("getInternalTxns", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch internal transactions for a contract", async () => {
    const mockResponse = { data: "internal txns" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getInternalTxns(1, 10, "0xabc", 0);

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}contracts/get-internal-tx?page=1&limit=10&contractAddress=0xabc`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws for getInternalTxns", async () => {
    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getInternalTxns(1, 10, "0xabc", 0);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});

describe("getInternalTxnsByHash", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch internal transactions by hash", async () => {
    const mockResponse = { data: "internal txns by hash" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getInternalTxnsByHash(2, 20, "0xdef", 0);

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}transactions/internal/0xdef?page=2&limit=20`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws for getInternalTxnsByHash", async () => {
    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getInternalTxnsByHash(2, 20, "0xdef", 0);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
