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

import getGraphData from "../getGraphData";
const mockConstants = require("@/constant/constant");
import {
  ALL_CHARTS_HOUR,
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";

describe("getGraphData", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should call EVM API for ALL_CHARTS_HOUR", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");
    const mockResponse = { data: "evm hour chart" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getGraphData(
      ALL_CHARTS_HOUR,
      "graph/test",
      "Some Chart"
    );

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}graph/test?interval=60&time=m`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call EVM API for ALL_CHART_ONE_DAY", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");
    const mockResponse = { data: "evm one day chart" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getGraphData(
      ALL_CHART_ONE_DAY,
      "graph/test",
      "Some Chart"
    );

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}graph/test?interval=24&time=h`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call Native API if chain is null and chartTitle is 'Total Accounts'", async () => {
    global.localStorage.getItem = jest.fn(() => null);
    const mockResponse = { data: "native chart" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getGraphData(
      ALL_CHART_ONE_DAY,
      "graph/test",
      "Total Accounts"
    );

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}graph/test?interval=24&time=h`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call EVM API if chartTitle is not 'Total Accounts'", async () => {
    global.localStorage.getItem = jest.fn(() => null);
    const mockResponse = { data: "evm fallback chart" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getGraphData(
      ALL_CHART_ONE_DAY,
      "graph/test",
      "Other Chart"
    );

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}graph/test?interval=24&time=h`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");
    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getGraphData(ALL_CHARTS_HOUR, "graph/test", "Some Chart");
    } catch (err) {
      expect(err).toBe(mockError);
    }
  });
});
