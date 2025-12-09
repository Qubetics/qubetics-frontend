// Mock constants BEFORE importing module
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

// Mock localStorage globally
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(),
  },
  writable: true,
});

import getAllTokens from "../getAllTokens";

const mockConstants = require("@/constant/constant");

describe("getAllTokens", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should call EVM API with order when chainType = 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockResponse = { data: "evm tokens" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllTokens(1, 10, "asc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}tokens/all-tokens?page=1&limit=10&order=asc`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should call EVM API WITHOUT order when order = ''", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockResponse = { data: "evm tokens no order" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllTokens(2, 20, "");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}tokens/all-tokens?page=2&limit=20`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should call Native API when chainType != 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("Native Chain");

    const mockResponse = { data: "native tokens" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllTokens(3, 15, "");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}tokens/all-tokens?page=3&limit=15`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getAllTokens(1, 10, "asc");
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });

  test("should fallback to Native chain if chainType is null", async () => {
    global.localStorage.getItem.mockReturnValue(null);

    const mockResponse = { data: "native tokens fallback" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllTokens(5, 25, "");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}tokens/all-tokens?page=5&limit=25`
    );

    expect(res).toEqual(mockResponse);
  });

  test("should handle window undefined gracefully", async () => {
    const oldWindow = global.window;
    delete global.window;

    global.localStorage.getItem.mockReturnValue(null);

    const mockResponse = { data: "window-undefined native tokens" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const res = await getAllTokens(1, 10, "");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}tokens/all-tokens?page=1&limit=10`
    );

    expect(res).toEqual(mockResponse);

    global.window = oldWindow;
  });
});
