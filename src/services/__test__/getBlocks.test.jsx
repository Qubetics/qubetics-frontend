// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

// Mock localStorage BEFORE import
Object.defineProperty(global, "localStorage", {
  value: { getItem: jest.fn() },
  writable: true,
});

// Import API
import getBlocks from "../getBlocks";

// Load constants for URL matching
const constants = require("@/constant/constant");

describe("getBlocks", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should call EVM API when chainType = 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockResponse = { data: "evm-blocks" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getBlocks(1, 20, "all", "desc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${constants.EXPLORER_API_URL}blocks/get-all-blocks?page=1&limit=20&order=desc&filterBy=all`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should call Native API when chainType != 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("Native Chain");

    const mockResponse = { data: "native-blocks" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getBlocks(2, 50, "pending", "asc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${constants.NATIVE_EXPLORER_API_URL}blocks?page=2&limit=50&order=asc&filterBy=pending`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should default to EVM Chain when chainType is null", async () => {
    global.localStorage.getItem.mockReturnValue(null);

    const mockResponse = { data: "default-evm" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getBlocks(3, 10, "confirmed", "desc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${constants.EXPLORER_API_URL}blocks/get-all-blocks?page=3&limit=10&order=desc&filterBy=confirmed`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should return error if fetch throws", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getBlocks(1, 10, "all", "desc");

    expect(result).toBe(mockError);
  });

  test("should handle window undefined gracefully", async () => {
    const originalWindow = global.window;
    delete global.window;

    global.localStorage.getItem.mockReturnValue(null);

    const mockResponse = { data: "fallback-evm" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getBlocks(4, 25, "failed", "asc");

    expect(global.fetch).toHaveBeenCalledWith(
      `${constants.EXPLORER_API_URL}blocks/get-all-blocks?page=4&limit=25&order=asc&filterBy=failed`
    );

    expect(result).toEqual(mockResponse);

    global.window = originalWindow;
  });
});
