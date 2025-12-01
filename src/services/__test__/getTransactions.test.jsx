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

import getTransactions from "../getTransactions";
const mockConstants = require("@/constant/constant");

describe("getTransactions", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should call EVM API when chainType is 'EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");
    const mockResponse = { data: "evm transactions" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactions(1, 10, "asc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}transactions/get-all-transactions?page=1&limit=10&order=asc`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call Native API when chainType is not 'EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "Native Chain");
    const mockResponse = { data: "native transactions" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactions(2, 20, "desc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}transactions?page=2&limit=20&order=desc`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should fallback to EVM API if chainType is null", async () => {
    global.localStorage.getItem = jest.fn(() => null);
    const mockResponse = { data: "fallback transactions" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactions(3, 5, "asc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}transactions/get-all-transactions?page=3&limit=5&order=asc`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch throws", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    const result = await getTransactions(1, 10, "asc");

    expect(result).toBe(mockError);
  });

  it("should work when window is undefined", async () => {
    const originalWindow = global.window;
    delete global.window;

    global.localStorage.getItem = jest.fn(() => "Native Chain");
    const mockResponse = { data: "native no window" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactions(1, 10, "asc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}transactions?page=1&limit=10&order=asc`
    );
    expect(result).toEqual(mockResponse);

    global.window = originalWindow;
  });
});
