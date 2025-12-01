// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

// Mock localStorage BEFORE import
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(),
  },
  writable: true,
});

import getSearchingValue from "../getGlobalSearch";
const mockConstants = require("@/constant/constant");

describe("getSearchingValue", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should call EVM API when chain='EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockResponse = { data: "evm-search" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getSearchingValue("sachin");

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/search-active-results?page=1&limit=10&searchedWord=sachin`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call Native API when chain!='EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "Native Chain");

    const mockResponse = { data: "native-search" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getSearchingValue("test");

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}explorer/searching?value=test`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should handle fetch error", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockErr = new Error("Network Error");
    global.fetch.mockRejectedValue(mockErr);

    try {
      await getSearchingValue("err");
    } catch (err) {
      expect(err).toBe(mockErr);
    }
  });

  test("should fallback when window is undefined", async () => {
    const originalWindow = global.window;
    delete global.window;

    global.localStorage.getItem = jest.fn(() => "Native Chain");

    const mockResponse = { data: "no-window" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getSearchingValue("demo");

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}explorer/searching?value=demo`
    );
    expect(result).toEqual(mockResponse);

    global.window = originalWindow;
  });
});
