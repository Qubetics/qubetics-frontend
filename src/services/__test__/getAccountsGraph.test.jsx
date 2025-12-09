import getTotalAccountGraph from "../getAccountsGraph";
import {
  ALL_CHARTS_HOUR,
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";
import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

// Mock fetch globally
global.fetch = jest.fn();

describe("getTotalAccountGraph API", () => {
  beforeEach(() => {
    fetch.mockClear();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
      },
      writable: true,
    });
  });

  test("calls EVM API when chain === 'EVM Chain' for ALL_CHARTS_HOUR", async () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockResponse = { data: "evm-hour-data" };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTotalAccountGraph(ALL_CHARTS_HOUR);

    expect(fetch).toHaveBeenCalledWith(
      `${EXPLORER_API_URL}explorer/graph/account?interval=60&time=mintue`
    );

    expect(result).toEqual(mockResponse);
  });

  test("calls Native API for ALL_CHART_ONE_DAY", async () => {
    window.localStorage.getItem.mockReturnValue("Native Chain");

    const mockResponse = { data: "native-daily" };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTotalAccountGraph(ALL_CHART_ONE_DAY);

    expect(fetch).toHaveBeenCalledWith(
      `${NATIVE_EXPLORER_API_URL}explorer/graph/account?interval=1&time=d`
    );

    expect(result).toEqual(mockResponse);
  });

  test("handles TRANS_HISTORY_CHART_YEAR correctly", async () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockResponse = { data: "year-data" };

    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    await getTotalAccountGraph(TRANS_HISTORY_CHART_YEAR);

    expect(fetch).toHaveBeenCalledWith(
      `${EXPLORER_API_URL}explorer/graph/account?interval=12&time=monthly`
    );
  });

  test("handles ALL_CHART_SEVEN_DAY correctly", async () => {
    window.localStorage.getItem.mockReturnValue("Native Chain");

    fetch.mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    });

    await getTotalAccountGraph(ALL_CHART_SEVEN_DAY);

    expect(fetch).toHaveBeenCalledWith(
      `${NATIVE_EXPLORER_API_URL}explorer/graph/account?interval=7&time=d`
    );
  });

  test("returns error on fetch failure", async () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockError = new Error("Network Error");
    fetch.mockRejectedValue(mockError);

    const result = await getTotalAccountGraph(ALL_CHART_ONE_DAY);

    expect(result).toBe(mockError);
  });
});
