// ---- Mock constants BEFORE importing the function ----
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://test-api/",
}));

jest.mock("@/constant/graphTableValues", () => ({
  ALL_CHARTS_HOUR: "1H",
  ALL_CHART_ONE_DAY: "1D",
  ALL_CHART_SEVEN_DAY: "7D",
  TRANS_HISTORY_CHART_YEAR: "1Y",
}));

import getCoinTransactionGraph from "../getCoinTransactionGraph";
import {
  ALL_CHARTS_HOUR,
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";

describe("getCoinTransactionGraph", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  const mockResponse = { success: true };

  const mockFetch = () =>
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

  test("should call API for ALL_CHARTS_HOUR", async () => {
    mockFetch();

    const res = await getCoinTransactionGraph(ALL_CHARTS_HOUR);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api/explorer/graph/coin-transfer?interval=60&time=mintue"
    );
    expect(res).toEqual(mockResponse);
  });

  test("should call API for ALL_CHART_ONE_DAY", async () => {
    mockFetch();

    const res = await getCoinTransactionGraph(ALL_CHART_ONE_DAY);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api/explorer/graph/coin-transfer?interval=24&time=hourly"
    );
    expect(res).toEqual(mockResponse);
  });

  test("should call API for TRANS_HISTORY_CHART_YEAR", async () => {
    mockFetch();

    const res = await getCoinTransactionGraph(TRANS_HISTORY_CHART_YEAR);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api/explorer/graph/coin-transfer?interval=12&time=monthly"
    );
    expect(res).toEqual(mockResponse);
  });

  test("should call API for ALL_CHART_SEVEN_DAY", async () => {
    mockFetch();

    const res = await getCoinTransactionGraph(ALL_CHART_SEVEN_DAY);

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api/explorer/graph/coin-transfer?interval=7&time=daily"
    );
    expect(res).toEqual(mockResponse);
  });

  test("should call API with default (30 days) when chartType not matched", async () => {
    mockFetch();

    const res = await getCoinTransactionGraph("UNKNOWN");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://test-api/explorer/graph/coin-transfer?interval=30&time=daily"
    );
    expect(res).toEqual(mockResponse);
  });

  test("should return error when fetch rejects", async () => {
    const mockError = new Error("Network error");

    global.fetch.mockRejectedValue(mockError);

    const res = await getCoinTransactionGraph(ALL_CHART_ONE_DAY);

    expect(res).toBe(mockError);
  });
});
