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

// Chart constants
import {
  ALL_CHARTS_HOUR,
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";

import getContractsGraph from "../getContractsGraph";
const constants = require("@/constant/constant");

describe("getContractsGraph", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("EVM → ALL_CHARTS_HOUR", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockResponse = { data: "hour-evm" };
    global.fetch.mockResolvedValue({ json: () => mockResponse });

    const res = await getContractsGraph(ALL_CHARTS_HOUR);

    expect(global.fetch).toHaveBeenCalledWith(
      `${constants.EXPLORER_API_URL}explorer/graph/contract-deployed?interval=60&time=mintue`
    );

    expect(res).toEqual(mockResponse);
  });

  test("Native → ALL_CHARTS_HOUR", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "Native Chain"),
    };

    const mockResponse = { data: "hour-native" };
    global.fetch.mockResolvedValue({ json: () => mockResponse });

    await getContractsGraph(ALL_CHARTS_HOUR);

    expect(global.fetch).toHaveBeenCalledWith(
      `${constants.NATIVE_EXPLORER_API_URL}explorer/graph/contract-deployed?interval=1&time=h`
    );
  });

  test("EVM → ALL_CHART_ONE_DAY", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockRes = { data: "day-evm" };
    global.fetch.mockResolvedValue({ json: () => mockRes });

    await getContractsGraph(ALL_CHART_ONE_DAY);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://evm-api.test/explorer/graph/contract-deployed?interval=24&time=hourly`
    );
  });

  test("Native → ALL_CHART_ONE_DAY", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "Native Chain"),
    };

    const mockRes = { data: "day-native" };
    global.fetch.mockResolvedValue({ json: () => mockRes });

    await getContractsGraph(ALL_CHART_ONE_DAY);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://native-api.test/explorer/graph/contract-deployed?interval=1&time=d`
    );
  });

  test("EVM → TRANS_HISTORY_CHART_YEAR", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockRes = { data: "year-evm" };
    global.fetch.mockResolvedValue({ json: () => mockRes });

    await getContractsGraph(TRANS_HISTORY_CHART_YEAR);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://evm-api.test/explorer/graph/contract-deployed?interval=12&time=monthly`
    );
  });

  test("Native → TRANS_HISTORY_CHART_YEAR", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "Native Chain"),
    };

    const mockRes = { data: "year-native" };
    global.fetch.mockResolvedValue({ json: () => mockRes });

    await getContractsGraph(TRANS_HISTORY_CHART_YEAR);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://native-api.test/explorer/graph/contract-deployed?interval=1&time=y`
    );
  });

  test("EVM → ALL_CHART_SEVEN_DAY", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockRes = { data: "seven-evm" };
    global.fetch.mockResolvedValue({ json: () => mockRes });

    await getContractsGraph(ALL_CHART_SEVEN_DAY);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://evm-api.test/explorer/graph/contract-deployed?interval=7&time=daily`
    );
  });

  test("Native → ALL_CHART_SEVEN_DAY", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "Native Chain"),
    };

    const mockRes = { data: "seven-native" };
    global.fetch.mockResolvedValue({ json: () => mockRes });

    await getContractsGraph(ALL_CHART_SEVEN_DAY);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://native-api.test/explorer/graph/contract-deployed?interval=7&time=d`
    );
  });

  test("Error handling", async () => {
    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    const res = await getContractsGraph(ALL_CHARTS_HOUR);

    expect(res).toBe(mockError);
  });
});
