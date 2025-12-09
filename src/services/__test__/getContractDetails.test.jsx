// Mock constants BEFORE imports
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

// Mock localStorage BEFORE importing module
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(() => "EVM Chain"),
  },
  writable: true,
});

import getContractDetails from "../getContractDetails";
const mockConstants = require("@/constant/constant");

describe("getContractDetails", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should call EVM API when chainType = 'EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockResponse = { data: "evm contract details" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getContractDetails("abcd123");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}contracts/contract-detail-by-address/abcd123`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should call Native API when chainType != 'EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "Native Chain");

    const mockResponse = { data: "native contract details" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getContractDetails("xyz999");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}contracts/contract-detail-by-address/xyz999`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should fallback to Native API when chainType is null", async () => {
    global.localStorage.getItem = jest.fn(() => null);

    const mockResponse = { data: "fallback native contract" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getContractDetails("fallback123");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}contracts/contract-detail-by-address/fallback123`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should handle window undefined gracefully", async () => {
    const originalWindow = global.window;
    delete global.window;

    global.localStorage.getItem = jest.fn(() => null);

    const mockResponse = { data: "window undefined case" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getContractDetails("winless555");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}contracts/contract-detail-by-address/winless555`
    );

    expect(res).toEqual(mockResponse);

    global.window = originalWindow;
  });

  test("should return error when fetch rejects", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getContractDetails("err001");
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
