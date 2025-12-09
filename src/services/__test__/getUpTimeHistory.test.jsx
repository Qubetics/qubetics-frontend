// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

jest.mock("@/constant/graphTableValues", () => ({
  TRANS_HISTORY_CHART_7_DAYS: "7d",
  TRANS_HISTORY_CHART_30_DAYS: "30d",
  TRANS_HISTORY_CHART_365_DAYS: "365d",
  TRANS_HISTORY_CHART_YEAR: "year",
}));

import getUpTimeHistory from "../getUpTimeHistory";
const mockConstants = require("@/constant/constant");
const mockGraphValues = require("@/constant/graphTableValues");

describe("getUpTimeHistory", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should call API with 7d duration for TRANS_HISTORY_CHART_7_DAYS", async () => {
    const mockResponse = { data: "uptime 7d" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUpTimeHistory(
      mockGraphValues.TRANS_HISTORY_CHART_7_DAYS,
      "node1"
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}session/up-timehistory?nodeAddress=node1&duration=7d`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call API with 30d duration for TRANS_HISTORY_CHART_30_DAYS", async () => {
    const mockResponse = { data: "uptime 30d" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUpTimeHistory(
      mockGraphValues.TRANS_HISTORY_CHART_30_DAYS,
      "node2"
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}session/up-timehistory?nodeAddress=node2&duration=30d`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call API with 365d duration for TRANS_HISTORY_CHART_YEAR", async () => {
    const mockResponse = { data: "uptime 365d" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getUpTimeHistory(
      mockGraphValues.TRANS_HISTORY_CHART_YEAR,
      "node3"
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}session/up-timehistory?nodeAddress=node3&duration=365d`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch throws", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getUpTimeHistory(
      mockGraphValues.TRANS_HISTORY_CHART_7_DAYS,
      "nodeX"
    );

    expect(result).toBe(mockError);
  });
});
