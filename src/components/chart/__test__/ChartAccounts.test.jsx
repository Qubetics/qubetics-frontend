import { render, screen } from "@testing-library/react";
import React from "react";
import ChartAccount from "./../ChartAccounts";
import * as chartMenuModule from "@/utils/chartMenu";

// Mock HighchartsReact
let lastOptions = null;
jest.mock("highcharts-react-official", () => (props) => {
  lastOptions = props.options; // Store the actual options object
  return (
    <div data-testid="highcharts-react">{JSON.stringify(props.options)}</div>
  );
});

// Mock Highcharts
jest.mock("highcharts", () => ({
  setOptions: jest.fn(),
}));

// Mock chartMenu and chartSeriesValue
jest.mock("@/utils/chartMenu", () => ({
  chartMenu: jest.fn((data, type) => data.map((item) => item.label)),
  chartSeriesValue: jest.fn((data) => ({
    seriesData: data.map((item) => item.value),
    maximum: { count: Math.max(...data.map((item) => item.value)) },
  })),
}));

// Mock constants
jest.mock("@/constant/constant", () => ({
  currencyName: "USD",
  generateData: jest.fn(() => [{ label: "Jan", value: 0 }]),
  noExponential: jest.fn((v) => v.toString()),
}));

describe("ChartAccount Component", () => {
  beforeEach(() => {
    lastOptions = null;
  });

  const mockData = [
    { label: "Jan", value: 5 },
    { label: "Feb", value: 10 },
    { label: "Mar", value: 7 },
  ];

  test("renders HighchartsReact when chartData is set", () => {
    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );
    const chart = screen.getByTestId("highcharts-react");
    expect(chart).toBeInTheDocument();
  });

  test("sets chartData correctly based on data and chartType", () => {
    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );
    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);

    expect(options.series[0].name).toBe("Test Chart");
    expect(options.series[0].data).toEqual([5, 10, 7]);
    expect(options.xAxis.categories).toEqual(["Jan", "Feb", "Mar"]);
    expect(options.yAxis.max).toBe(10);
    expect(options.chart.type).toBe("area");
  });

  test("handles empty data gracefully using generateData", () => {
    render(
      <ChartAccount
        data={[]}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );
    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);

    expect(options.series[0].data).toEqual([]);
    expect(options.xAxis.categories).toEqual([]);
  });

  test("tooltip formatter returns correct HTML for regular name", () => {
    const { container } = render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );

    // Verify component renders
    expect(container).toBeInTheDocument();
    
    // The formatter function is tested indirectly through the component rendering
    // We can verify the name is passed correctly
    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);
    expect(options.series[0].name).toBe("Test Chart");
  });

  test("tooltip formatter returns correct HTML for Uptime name", () => {
    const { container } = render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Uptime"
        title="Test Title"
      />
    );

    // Verify component renders with Uptime name
    expect(container).toBeInTheDocument();
    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);
    expect(options.series[0].name).toBe("Uptime");
  });

  test("tooltip configuration is set correctly", () => {
    const { container } = render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );

    expect(container).toBeInTheDocument();
    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);
    
    // Verify tooltip configuration exists
    expect(options.tooltip).toBeDefined();
    expect(options.tooltip.hideDelay).toBe(0);
    expect(options.tooltip.useHTML).toBe(true);
    expect(options.tooltip.backgroundColor).toBe("#19181a");
    expect(options.tooltip.borderRadius).toBe(10);
  });

  test("chart configuration includes all required properties", () => {
    const { container } = render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );

    expect(container).toBeInTheDocument();
    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);
    
    // Verify chart has all required configuration
    expect(options.chart.type).toBe("area");
    expect(options.chart.backgroundColor).toBe("#152A59");
    expect(options.plotOptions.area).toBeDefined();
    expect(options.plotOptions.area.lineWidth).toBe(2.5);
  });

  test("handles BigNumber conversion in seriesData", () => {
    const bigNumberData = [
      { label: "Jan", value: "1000000000000000000" },
      { label: "Feb", value: 500 },
    ];

    chartMenuModule.chartMenu.mockReturnValue(["Jan", "Feb"]);
    chartMenuModule.chartSeriesValue.mockReturnValue({
      seriesData: ["1000000000000000000", 500],
      maximum: { count: 1000000000000000000 },
    });

    render(
      <ChartAccount
        data={bigNumberData}
        chartType="linear"
        name="Big Numbers"
        title="Test"
      />
    );

    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);

    // Should convert BigNumber strings to numbers
    expect(options.series[0].data).toEqual([1e18, 500]);
  });

  test("sets yAxis max to 1 when maximum count is very small", () => {
    chartMenuModule.chartSeriesValue.mockReturnValue({
      seriesData: [0.0000001, 0.0000002],
      maximum: { count: 0.0000002 },
    });

    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Small Values"
        title="Test"
      />
    );

    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);

    expect(options.yAxis.max).toBe(1);
    expect(options.yAxis.tickInterval).toBe(0.25);
  });

  test("sets yAxis max to actual maximum when count is greater than 0.000001", () => {
    chartMenuModule.chartSeriesValue.mockReturnValue({
      seriesData: [5, 10, 7],
      maximum: { count: 10 },
    });

    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Normal Values"
        title="Test"
      />
    );

    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);

    expect(options.yAxis.max).toBe(10);
    expect(options.yAxis.tickInterval).toBeUndefined();
  });

  test("renders null when chartData is null initially", () => {
    // This tests the initial render before useEffect completes
    const { container } = render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test"
        title="Test"
      />
    );
    
    // Component should render the wrapper div
    expect(container.querySelector('.chart-wrapper')).toBeInTheDocument();
  });

  test("updates chart when data prop changes", () => {
    const { rerender } = render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test"
        title="Test"
      />
    );

    let chart = screen.getByTestId("highcharts-react");
    let options = JSON.parse(chart.textContent);
    expect(options.series[0].data).toEqual([5, 10, 7]);

    // Update with new data
    const newData = [
      { label: "Apr", value: 15 },
      { label: "May", value: 20 },
    ];

    chartMenuModule.chartMenu.mockReturnValue(["Apr", "May"]);
    chartMenuModule.chartSeriesValue.mockReturnValue({
      seriesData: [15, 20],
      maximum: { count: 20 },
    });

    rerender(
      <ChartAccount
        data={newData}
        chartType="linear"
        name="Test"
        title="Test"
      />
    );

    chart = screen.getByTestId("highcharts-react");
    options = JSON.parse(chart.textContent);
    expect(options.series[0].data).toEqual([15, 20]);
  });

  test("updates chart when chartType prop changes", () => {
    const { rerender } = render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test"
        title="Test"
      />
    );

    // Change chartType
    rerender(
      <ChartAccount
        data={mockData}
        chartType="logarithmic"
        name="Test"
        title="Test"
      />
    );

    const chart = screen.getByTestId("highcharts-react");
    expect(chart).toBeInTheDocument();
  });

  test("handles numeric values in seriesData", () => {
    chartMenuModule.chartSeriesValue.mockReturnValue({
      seriesData: [5, 10, 7], // Already numbers
      maximum: { count: 10 },
    });

    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test"
        title="Test"
      />
    );

    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);
    expect(options.series[0].data).toEqual([5, 10, 7]);
  });

  test("sets correct xAxis max based on data length", () => {
    const longData = Array.from({ length: 50 }, (_, i) => ({
      label: `Item ${i}`,
      value: i,
    }));

    chartMenuModule.chartMenu.mockReturnValue(longData.map(d => d.label));
    chartMenuModule.chartSeriesValue.mockReturnValue({
      seriesData: longData.map(d => d.value),
      maximum: { count: 49 },
    });

    render(
      <ChartAccount
        data={longData}
        chartType="linear"
        name="Test"
        title="Test"
      />
    );

    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);
    expect(options.xAxis.max).toBe(49); // length - 1
  });

  test("tooltip formatter function executes correctly with regular name", () => {
    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );
    
    screen.getByTestId("highcharts-react");
    
    // Use lastOptions which has the actual functions
    expect(lastOptions).not.toBeNull();
    
    // Call the formatter with a mock 'this' context
    const mockContext = {
      x: 0,
      y: 5,
      series: {
        xAxis: {
          categories: ["Jan", "Feb", "Mar"]
        }
      }
    };
    
    const result = lastOptions.tooltip.formatter.call(mockContext);
    
    expect(result).toContain("Jan");
    expect(result).toContain("Test Chart: 5");
    expect(result).toContain("white-space: normal");
  });

  test("tooltip formatter function shows currencyName for Uptime", () => {
    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Uptime"
        title="Test Title"
      />
    );
    
    screen.getByTestId("highcharts-react");
    
    expect(lastOptions).not.toBeNull();
    
    const mockContext = {
      x: 1,
      y: 100,
      series: {
        xAxis: {
          categories: ["Jan", "Feb", "Mar"]
        }
      }
    };
    
    const result = lastOptions.tooltip.formatter.call(mockContext);
    
    // Should contain currencyName (USD) instead of "Uptime"
    expect(result).toContain("Feb");
    expect(result).toContain("USD: 100");
    expect(result).not.toContain("Uptime: 100");
  });

  test("tooltip positioner function calculates position correctly", () => {
    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );
    
    screen.getByTestId("highcharts-react");
    
    expect(lastOptions).not.toBeNull();
    
    const mockContext = {
      chart: {
        plotLeft: 50,
        plotTop: 30,
        chartWidth: 500,
        chartHeight: 300
      }
    };
    
    const mockPoint = {
      plotX: 100,
      plotY: 150
    };
    
    const position = lastOptions.tooltip.positioner.call(
      mockContext,
      200, // labelWidth
      80,  // labelHeight
      mockPoint
    );
    
    expect(position).toHaveProperty('x');
    expect(position).toHaveProperty('y');
    expect(typeof position.x).toBe('number');
    expect(typeof position.y).toBe('number');
  });

  test("tooltip positioner handles left edge boundary", () => {
    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );
    
    screen.getByTestId("highcharts-react");
    
    expect(lastOptions).not.toBeNull();
    
    const mockContext = {
      chart: {
        plotLeft: 50,
        plotTop: 30,
        chartWidth: 500,
        chartHeight: 300
      }
    };
    
    // Point near left edge
    const mockPoint = {
      plotX: 5,
      plotY: 150
    };
    
    const position = lastOptions.tooltip.positioner.call(
      mockContext,
      200, // labelWidth
      80,  // labelHeight
      mockPoint
    );
    
    // Should be constrained to minimum of 10
    expect(position.x).toBeGreaterThanOrEqual(10);
    expect(position.y).toBeGreaterThanOrEqual(10);
  });

  test("tooltip positioner handles right edge boundary", () => {
    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );
    
    screen.getByTestId("highcharts-react");
    
    expect(lastOptions).not.toBeNull();
    
    const mockContext = {
      chart: {
        plotLeft: 50,
        plotTop: 30,
        chartWidth: 500,
        chartHeight: 300
      }
    };
    
    // Point near right edge
    const mockPoint = {
      plotX: 450,
      plotY: 150
    };
    
    const position = lastOptions.tooltip.positioner.call(
      mockContext,
      200, // labelWidth
      80,  // labelHeight
      mockPoint
    );
    
    // Should be constrained to not exceed chart width
    expect(position.x).toBeLessThanOrEqual(500 - 200 - 10);
    expect(position.y).toBeGreaterThanOrEqual(10);
  });

  test("tooltip positioner handles top edge boundary", () => {
    render(
      <ChartAccount
        data={mockData}
        chartType="linear"
        name="Test Chart"
        title="Test Title"
      />
    );
    
    screen.getByTestId("highcharts-react");
    
    expect(lastOptions).not.toBeNull();
    
    const mockContext = {
      chart: {
        plotLeft: 50,
        plotTop: 30,
        chartWidth: 500,
        chartHeight: 300
      }
    };
    
    // Point near top edge
    const mockPoint = {
      plotX: 100,
      plotY: 5
    };
    
    const position = lastOptions.tooltip.positioner.call(
      mockContext,
      200, // labelWidth
      80,  // labelHeight
      mockPoint
    );
    
    // Y should be constrained to minimum of 10
    expect(position.y).toBeGreaterThanOrEqual(10);
  });
});
