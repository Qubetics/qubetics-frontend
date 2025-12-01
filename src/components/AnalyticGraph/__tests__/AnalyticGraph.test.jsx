import React from "react";
import { render } from "@testing-library/react";
import AnalyticGraph from "../AnalyticGraph";
import HighchartsReact from "highcharts-react-official";

jest.mock("highcharts/highstock", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("highcharts-react-official", () => {
  return jest.fn(() => <div data-testid="highcharts-react" />);
});

jest.mock("@/utils/commonFunctions", () => ({
  formatDecimal: (value) => value.toString(), // simple mock
}));

describe("AnalyticGraph Component", () => {
  const mockData = [
    {
      createdAt: 1700000000,
      count: {
        transferAmount: 1500.567,
        transferCount: 20,
        uniqueSenders: 5,
        uniqueReceivers: 7,
        totalUniques: 12,
      },
    },
  ];

  const mockDataWithZeros = [
    {
      createdAt: 1700000000,
      count: {
        transferAmount: 0,
        transferCount: 0,
        uniqueSenders: 0,
        uniqueReceivers: 0,
        totalUniques: 0,
      },
    },
  ];

  const mockDataMultiple = [
    {
      createdAt: 1700000000,
      count: {
        transferAmount: 100,
        transferCount: 10,
        uniqueSenders: 2,
        uniqueReceivers: 3,
        totalUniques: 5,
      },
    },
    {
      createdAt: 1700000001,
      count: {
        transferAmount: 200,
        transferCount: 20,
        uniqueSenders: 4,
        uniqueReceivers: 6,
        totalUniques: 10,
      },
    },
  ];

  beforeEach(() => {
    // Clear mock calls before each test
    HighchartsReact.mockClear();
  });

  test("renders HighchartsReact", () => {
    const { getByTestId } = render(<AnalyticGraph apiData={mockData} />);

    expect(getByTestId("highcharts-react")).toBeInTheDocument();
  });

  test("passes correct options to HighchartsReact", () => {
    render(<AnalyticGraph apiData={mockData} />);

    expect(HighchartsReact).toHaveBeenCalled();

    const callArgs = HighchartsReact.mock.calls[0][0];

    // Check highcharts core is passed
    expect(callArgs.highcharts).toBeDefined();

    // Check options exist
    expect(callArgs.options).toBeDefined();

    // Check series exist and mapped correctly
    expect(callArgs.options.series.length).toBe(5);

    // Timestamp should be multiplied by 1000
    expect(callArgs.options.series[0].data[0][0]).toBe(1700000000 * 1000);

    // Value should be Number(formatDecimal())
    expect(callArgs.options.series[0].data[0][1]).toBe(1500.567);
  });

  test("passes correct options structure", () => {
    render(<AnalyticGraph apiData={mockData} />);

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    expect(options.title.text).toBe("Time Series: Token Contract Overview");
    expect(options.title.align).toBe("left");
    expect(options.xAxis.type).toBe("datetime");
    expect(options.yAxis).toHaveLength(2);
    expect(options.yAxis[0].title.text).toBe("Amount");
    expect(options.yAxis[1].title.text).toBe("Token Transfer Count");
    expect(options.tooltip.shared).toBe(true);
    expect(options.legend.enabled).toBe(true);
    expect(options.rangeSelector.selected).toBe(1);
    expect(options.navigator.enabled).toBe(true);
    expect(options.scrollbar.enabled).toBe(false);
  });

  test("handles null apiData", () => {
    render(<AnalyticGraph apiData={null} />);

    expect(HighchartsReact).toHaveBeenCalled();

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // Series data should be undefined when apiData is null
    expect(options.series[0].data).toBeUndefined();
    expect(options.series[1].data).toBeUndefined();
    expect(options.series[2].data).toBeUndefined();
    expect(options.series[3].data).toBeUndefined();
    expect(options.series[4].data).toBeUndefined();
  });

  test("handles empty apiData array", () => {
    render(<AnalyticGraph apiData={[]} />);

    expect(HighchartsReact).toHaveBeenCalled();

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // Series data should be empty arrays when apiData is empty
    expect(options.series[0].data).toEqual([]);
    expect(options.series[1].data).toEqual([]);
    expect(options.series[2].data).toEqual([]);
    expect(options.series[3].data).toEqual([]);
    expect(options.series[4].data).toEqual([]);
  });

  test("handles zero values in apiData", () => {
    render(<AnalyticGraph apiData={mockDataWithZeros} />);

    expect(HighchartsReact).toHaveBeenCalled();

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // Values should be 0 when count properties are 0
    expect(options.series[0].data[0][1]).toBe(0);
    expect(options.series[1].data[0][1]).toBe(0);
    expect(options.series[2].data[0][1]).toBe(0);
    expect(options.series[3].data[0][1]).toBe(0);
    expect(options.series[4].data[0][1]).toBe(0);
  });

  test("handles multiple data points", () => {
    render(<AnalyticGraph apiData={mockDataMultiple} />);

    expect(HighchartsReact).toHaveBeenCalled();

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // Should have 2 data points
    expect(options.series[0].data).toHaveLength(2);
    expect(options.series[0].data[0][0]).toBe(1700000000 * 1000);
    expect(options.series[0].data[0][1]).toBe(100);
    expect(options.series[0].data[1][0]).toBe(1700000001 * 1000);
    expect(options.series[0].data[1][1]).toBe(200);
  });

  test("handles missing transferAmount in count", () => {
    const dataWithMissingTransferAmount = [
      {
        createdAt: 1700000000,
        count: {
          transferCount: 20,
          uniqueSenders: 5,
          uniqueReceivers: 7,
          totalUniques: 12,
        },
      },
    ];

    render(<AnalyticGraph apiData={dataWithMissingTransferAmount} />);

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // transferAmount should default to 0 when missing
    expect(options.series[0].data[0][1]).toBe(0);
  });

  test("handles missing transferCount in count", () => {
    const dataWithMissingTransferCount = [
      {
        createdAt: 1700000000,
        count: {
          transferAmount: 1500,
          uniqueSenders: 5,
          uniqueReceivers: 7,
          totalUniques: 12,
        },
      },
    ];

    render(<AnalyticGraph apiData={dataWithMissingTransferCount} />);

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // transferCount should default to 0 when missing
    expect(options.series[1].data[0][1]).toBe(0);
  });

  test("handles missing uniqueSenders in count", () => {
    const dataWithMissingUniqueSenders = [
      {
        createdAt: 1700000000,
        count: {
          transferAmount: 1500,
          transferCount: 20,
          uniqueReceivers: 7,
          totalUniques: 12,
        },
      },
    ];

    render(<AnalyticGraph apiData={dataWithMissingUniqueSenders} />);

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // uniqueSenders should default to 0 when missing
    expect(options.series[3].data[0][1]).toBe(0);
  });

  test("handles missing uniqueReceivers in count", () => {
    const dataWithMissingUniqueReceivers = [
      {
        createdAt: 1700000000,
        count: {
          transferAmount: 1500,
          transferCount: 20,
          uniqueSenders: 5,
          totalUniques: 12,
        },
      },
    ];

    render(<AnalyticGraph apiData={dataWithMissingUniqueReceivers} />);

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // uniqueReceivers should default to 0 when missing
    expect(options.series[2].data[0][1]).toBe(0);
  });

  test("handles missing totalUniques in count", () => {
    const dataWithMissingTotalUniques = [
      {
        createdAt: 1700000000,
        count: {
          transferAmount: 1500,
          transferCount: 20,
          uniqueSenders: 5,
          uniqueReceivers: 7,
        },
      },
    ];

    render(<AnalyticGraph apiData={dataWithMissingTotalUniques} />);

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // totalUniques should default to 0 when missing
    expect(options.series[4].data[0][1]).toBe(0);
  });

  test("verifies all series configurations", () => {
    render(<AnalyticGraph apiData={mockData} />);

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // Verify Transfer Amount series
    expect(options.series[0].name).toBe("Transfer Amount");
    expect(options.series[0].color).toBe("magenta");
    expect(options.series[0].type).toBe("column");
    expect(options.series[0].yAxis).toBe(0);

    // Verify Transfer Count series
    expect(options.series[1].name).toBe("Transfer Count");
    expect(options.series[1].color).toBe("#FF69B4");
    expect(options.series[1].type).toBe("line");
    expect(options.series[1].yAxis).toBe(1);

    // Verify Unique Receivers series
    expect(options.series[2].name).toBe("Unique Receivers");
    expect(options.series[2].color).toBe("#FFD700");
    expect(options.series[2].type).toBe("line");
    expect(options.series[2].yAxis).toBe(1);

    // Verify Unique Senders series
    expect(options.series[3].name).toBe("Unique Senders");
    expect(options.series[3].color).toBe("#FFA500");
    expect(options.series[3].type).toBe("line");
    expect(options.series[3].yAxis).toBe(1);

    // Verify Total Uniques series
    expect(options.series[4].name).toBe("Total Uniques");
    expect(options.series[4].color).toBe("#00FFFF");
    expect(options.series[4].type).toBe("line");
    expect(options.series[4].yAxis).toBe(1);
  });

  test("verifies chart configuration", () => {
    render(<AnalyticGraph apiData={mockData} />);

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // Verify chart settings
    expect(options.chart.backgroundColor).toBe("#0E0E10");
    expect(options.chart.marginLeft).toBe(100);
    expect(options.chart.marginRight).toBe(100);
    expect(options.chart.inverted).toBe(false);
  });

  test("verifies styling configurations", () => {
    render(<AnalyticGraph apiData={mockData} />);

    const callArgs = HighchartsReact.mock.calls[0][0];
    const options = callArgs.options;

    // Verify title styling
    expect(options.title.style.color).toBe("#ffffff");
    expect(options.title.style.fontSize).toBe("22px");

    // Verify xAxis labels styling
    expect(options.xAxis.labels.style.color).toBe("#A0A0A3");

    // Verify yAxis styling
    expect(options.yAxis[0].labels.style.color).toBe("#A0A0A3");
    expect(options.yAxis[1].labels.style.color).toBe("#A0A0A3");
    expect(options.yAxis[1].title.style.color).toBe("#A0A0A3");
    expect(options.yAxis[1].opposite).toBe(true);

    // Verify tooltip styling
    expect(options.tooltip.backgroundColor).toBe("rgba(0, 0, 0, 0.8)");
    expect(options.tooltip.style.color).toBe("#ffffff");

    // Verify legend styling
    expect(options.legend.layout).toBe("horizontal");
    expect(options.legend.align).toBe("center");
    expect(options.legend.verticalAlign).toBe("bottom");
    expect(options.legend.itemStyle.color).toBe("white");
    expect(options.legend.itemHoverStyle.color).toBe("#A0A0A3");
  });
});
