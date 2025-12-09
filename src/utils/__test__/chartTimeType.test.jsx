import {
  ALL_CHARTS_HOUR,
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  ALL_CHART_THRITY_DAYS,
  TRANS_HISTORY_CHART_HOURS,
  TRANS_HISTORY_CHART_MINUTES,
  TRANS_HISTORY_CHART_SECONDS,
} from "@/constant/graphTableValues";

import { chartTimeType } from "@/utils/chartTimeType"; 

describe("chartTimeType Function", () => {
  let mockSetState;
  let chartState;
  let socketData;

  beforeEach(() => {
    mockSetState = jest.fn();

    chartState = {
      type: "",
      data: [],
      count: 0,
    };

    socketData = {
      finalData: {
        oneHour: [1],
        oneDay: [2],
        sevenDay: [3],
        thirtyDay: [4],
        tenSecond: [5],
        thirtyMinute: [6],
        sixHour: [7],
      },
      count: 99,
    };
  });

  test("should handle ALL_CHARTS_HOUR", () => {
    chartState.type = ALL_CHARTS_HOUR;

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.oneHour,
      count: socketData.count,
    });
  });

  test("should handle ALL_CHART_ONE_DAY", () => {
    chartState.type = ALL_CHART_ONE_DAY;

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.oneDay,
      count: socketData.count,
    });
  });

  test("should handle ALL_CHART_SEVEN_DAY", () => {
    chartState.type = ALL_CHART_SEVEN_DAY;

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.sevenDay,
      count: socketData.count,
    });
  });

  test("should handle ALL_CHART_THRITY_DAYS", () => {
    chartState.type = ALL_CHART_THRITY_DAYS;

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.thirtyDay,
      count: socketData.count,
    });
  });

  test("should handle TRANS_HISTORY_CHART_SECONDS", () => {
    chartState.type = TRANS_HISTORY_CHART_SECONDS;

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.oneDay,
      count: socketData.count,
    });
  });

  test("should handle TRANS_HISTORY_CHART_MINUTES", () => {
    chartState.type = TRANS_HISTORY_CHART_MINUTES;

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.sevenDay,
      count: socketData.count,
    });
  });

  test("should handle TRANS_HISTORY_CHART_HOURS", () => {
    chartState.type = TRANS_HISTORY_CHART_HOURS;

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.thirtyDay,
      count: socketData.count,
    });
  });

  test("should handle default case", () => {
    chartState.type = "UNKNOWN_TYPE";

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.oneHour,
      count: socketData.count,
    });
  });
});

describe("chartTimeType Function - mocked constants to reach TRANS_HISTORY cases", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("executes TRANS_HISTORY_CHART_SECONDS branch when constants are unique", () => {
    jest.doMock("@/constant/graphTableValues", () => ({
      ALL_CHARTS_HOUR: "1 Hour",
      ALL_CHART_ONE_DAY: "1 Day",
      ALL_CHART_SEVEN_DAY: "7 Days",
      ALL_CHART_THRITY_DAYS: "30 Days",
      TRANS_HISTORY_CHART_SECONDS: "TS_SECONDS",
      TRANS_HISTORY_CHART_MINUTES: "TS_MINUTES",
      TRANS_HISTORY_CHART_HOURS: "TS_HOURS",
    }));

    const { chartTimeType } = require("@/utils/chartTimeType");

    const mockSetState = jest.fn();
    const chartState = { type: "TS_SECONDS", data: [], count: 0 };
    const socketData = { finalData: { tenSecond: [10] }, count: 5 };

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.tenSecond,
    });
  });

  test("executes TRANS_HISTORY_CHART_MINUTES branch when constants are unique", () => {
    jest.doMock("@/constant/graphTableValues", () => ({
      ALL_CHARTS_HOUR: "1 Hour",
      ALL_CHART_ONE_DAY: "1 Day",
      ALL_CHART_SEVEN_DAY: "7 Days",
      ALL_CHART_THRITY_DAYS: "30 Days",
      TRANS_HISTORY_CHART_SECONDS: "TS_SECONDS",
      TRANS_HISTORY_CHART_MINUTES: "TS_MINUTES",
      TRANS_HISTORY_CHART_HOURS: "TS_HOURS",
    }));

    const { chartTimeType } = require("@/utils/chartTimeType");

    const mockSetState = jest.fn();
    const chartState = { type: "TS_MINUTES", data: [], count: 0 };
    const socketData = { finalData: { thirtyMinute: [20] }, count: 6 };

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.thirtyMinute,
    });
  });

  test("executes TRANS_HISTORY_CHART_HOURS branch when constants are unique", () => {
    jest.doMock("@/constant/graphTableValues", () => ({
      ALL_CHARTS_HOUR: "1 Hour",
      ALL_CHART_ONE_DAY: "1 Day",
      ALL_CHART_SEVEN_DAY: "7 Days",
      ALL_CHART_THRITY_DAYS: "30 Days",
      TRANS_HISTORY_CHART_SECONDS: "TS_SECONDS",
      TRANS_HISTORY_CHART_MINUTES: "TS_MINUTES",
      TRANS_HISTORY_CHART_HOURS: "TS_HOURS",
    }));

    const { chartTimeType } = require("@/utils/chartTimeType");

    const mockSetState = jest.fn();
    const chartState = { type: "TS_HOURS", data: [], count: 0 };
    const socketData = { finalData: { sixHour: [30] }, count: 7 };

    chartTimeType(mockSetState, chartState, socketData);

    expect(mockSetState).toHaveBeenCalledWith({
      ...chartState,
      data: socketData.finalData.sixHour,
    });
  });
});
