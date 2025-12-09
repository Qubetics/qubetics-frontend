// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

jest.mock("@/constant/graphTableValues", () => ({
  TRANS_HISTORY_CHART_SECONDS: "SECONDS",
  TRANS_HISTORY_CHART_YEAR: "YEAR",
  TRANS_HISTORY_CHART_MINUTES: "MINUTES",
}));

// Mock localStorage globally BEFORE import
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(),
  },
  writable: true,
});

import getTransactionGraph from "../getTransactionGraph";
const mockConstants = require("@/constant/constant");
const mockGraphValues = require("@/constant/graphTableValues");

describe("getTransactionGraph", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should call EVM API for TRANS_HISTORY_CHART_SECONDS", async () => {
    // Ensure `window` exists so the function reads localStorage
    global.window = {};
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockResponse = { tps: [1, 2, 3] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionGraph(
      mockGraphValues.TRANS_HISTORY_CHART_SECONDS
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/graph/tps?interval=24&time=hourly`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call EVM API for TRANS_HISTORY_CHART_YEAR", async () => {
    global.window = {};
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockResponse = { tps: [4, 5, 6] };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionGraph(
      mockGraphValues.TRANS_HISTORY_CHART_YEAR
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/graph/tps?interval=12&time=monthly`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call EVM API for TRANS_HISTORY_CHART_MINUTES", async () => {
    global.window = {};
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockResponse = { tps: [7, 8, 9] };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionGraph(
      mockGraphValues.TRANS_HISTORY_CHART_MINUTES
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/graph/tps?interval=7&time=daily`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call Native API when chainType is not 'EVM Chain'", async () => {
    // Remove window so typeof window === 'undefined' OR ensure chain is not EVM
    delete global.window;
    global.localStorage.getItem = jest.fn(() => "Native Chain");

    const mockResponse = { tps: [10, 11] };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionGraph(
      mockGraphValues.TRANS_HISTORY_CHART_MINUTES
    );

    // Expect the Native API branch when chainType is not EVM
    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}explorer/graph/tps?interval=7&time=d`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    global.window = {};
    global.localStorage.getItem = jest.fn(() => "EVM Chain");

    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getTransactionGraph(
      mockGraphValues.TRANS_HISTORY_CHART_SECONDS
    );

    expect(result).toBe(mockError);
  });

  it("should default to EVM API if localStorage returns null (window exists)", async () => {
    // When `window` exists and localStorage returns null, the code sets
    // chain to "EVM Chain". Reflect that behavior in the test by ensuring
    // `window` exists and getItem returns null.
    global.window = {};
    global.localStorage.getItem = jest.fn(() => null);

    const mockResponse = { tps: [12] };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTransactionGraph(
      mockGraphValues.TRANS_HISTORY_CHART_MINUTES
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/graph/tps?interval=7&time=daily`
    );
    expect(result).toEqual(mockResponse);
  });
});
