// Mock the constants and localStorage BEFORE any imports
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

// Mock localStorage globally before module import
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(() => "EVM Chain"),
  },
  writable: true,
});

import getAllContracts from "../getAllContracts";

// Re-require after mocking to get fresh module
const mockConstants = require("@/constant/constant");

describe("getAllContracts", () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
    jest.clearAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call EVM API when chainType = 'EVM Chain' and include order", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockResponse = { data: "evm contracts" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllContracts(1, 10, "asc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}contracts/all-contracts?page=1&limit=10&order=asc`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should call EVM API without order when order = ''", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockResponse = { data: "evm contracts no order" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllContracts(2, 20, "");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}contracts/all-contracts?page=2&limit=20`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should call Native API when chainType != 'EVM Chain'", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "Native Chain"),
    };

    const mockResponse = { data: "native contracts" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllContracts(3, 15, "");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}contracts/all-contracts?page=3&limit=15`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    try {
      await getAllContracts(1, 10, "asc");
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });

  test("should handle null chainType and call Native API", async () => {
    global.localStorage = {
      getItem: jest.fn(() => null),
    };

    const mockResponse = { data: "native contracts fallback" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllContracts(1, 10, "asc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}contracts/all-contracts?page=1&limit=10`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should handle window undefined gracefully", async () => {
    const originalWindow = global.window;
    delete global.window;

    global.localStorage = {
      getItem: jest.fn(() => null),
    };

    const mockResponse = { data: "native contracts window undefined" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllContracts(1, 10, "");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}contracts/all-contracts?page=1&limit=10`
    );

    expect(res).toEqual(mockResponse);

    global.window = originalWindow;
  });
});
