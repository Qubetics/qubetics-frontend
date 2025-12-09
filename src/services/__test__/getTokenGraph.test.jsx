// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
}));

jest.mock("@/constant/graphTableValues", () => ({
  ALL_CHART_ONE_DAY: "ONE_DAY",
  ALL_CHART_SEVEN_DAY: "SEVEN_DAY",
  TRANS_HISTORY_CHART_YEAR: "YEAR",
}));

import getTokenPriceGraph from "../getTokenGraph";
const mockConstants = require("@/constant/constant");
const mockGraphValues = require("@/constant/graphTableValues");

describe("getTokenPriceGraph", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch token price graph for ONE_DAY", async () => {
    const mockResponse = { price: 100 };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTokenPriceGraph(mockGraphValues.ALL_CHART_ONE_DAY);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/graph/token-price?interval=1&time=d`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should fetch token price graph for YEAR", async () => {
    const mockResponse = { price: 200 };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTokenPriceGraph(
      mockGraphValues.TRANS_HISTORY_CHART_YEAR
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/graph/token-price?interval=1&time=y`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should fetch token price graph for SEVEN_DAY", async () => {
    const mockResponse = { price: 150 };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTokenPriceGraph(
      mockGraphValues.ALL_CHART_SEVEN_DAY
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/graph/token-price?interval=7&time=d`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should use default interval/time when chartType is unknown", async () => {
    const mockResponse = { price: 50 };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTokenPriceGraph("UNKNOWN_CHART");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/graph/token-price?interval=30&time=d`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getTokenPriceGraph(mockGraphValues.ALL_CHART_ONE_DAY);

    expect(result).toEqual(mockError);
  });
});
