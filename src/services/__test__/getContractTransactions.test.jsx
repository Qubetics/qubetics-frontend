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

import getContractTransactions from "../getContractTransactions";
const mockConstants = require("@/constant/constant");

describe("getContractTransactions", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should call EVM tab=0 API when chain='EVM Chain'", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockResponse = { data: "evm tab0" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getContractTransactions(1, 10, "0xabc", 0);

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}contracts/all-transaction?page=1&limit=10&contractAddress=0xabc`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call EVM tab=1 API when chain='EVM Chain'", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockResponse = { data: "evm tab1" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getContractTransactions(2, 20, "0x123", 1);

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}contracts/transfer?page=2&limit=20&contractAddress=0x123`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call Native API when chain!='EVM Chain'", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "Native Chain"),
    };

    const mockResponse = { data: "native" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getContractTransactions(3, 15, "0x999", 0);

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}contracts/all-transaction?page=3&limit=15&contractAddress=0x999`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockErr = new Error("Network Error");
    global.fetch.mockRejectedValue(mockErr);

    try {
      await getContractTransactions(1, 10, "0xerror", 0);
    } catch (err) {
      expect(err).toBe(mockErr);
    }
  });

  test("should work when window is undefined", async () => {
    const originalWindow = global.window;
    delete global.window;

    global.localStorage = {
      getItem: jest.fn(() => "Native Chain"),
    };

    const mockResponse = { data: "native no window" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getContractTransactions(1, 10, "0xabc", 0);

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}contracts/all-transaction?page=1&limit=10&contractAddress=0xabc`
    );
    expect(result).toEqual(mockResponse);

    global.window = originalWindow;
  });
});
