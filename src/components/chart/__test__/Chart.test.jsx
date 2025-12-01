import { render, screen } from "@testing-library/react";
import Chart from "./../Chart";
import React from "react";

// Mock HighchartsReact so we don't render actual charts
jest.mock("highcharts-react-official", () => (props) => {
  return <div data-testid="highcharts-react">{JSON.stringify(props.options)}</div>;
});

// Mock Highcharts (optional, since we don't need to test Highcharts itself)
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

describe("Chart Component", () => {
  const mockData = [
    { label: "Jan", value: 5 },
    { label: "Feb", value: 10 },
    { label: "Mar", value: 7 },
  ];

  test("renders without crashing and shows HighchartsReact", () => {
    render(<Chart data={mockData} chartType="linear" />);
    const chart = screen.getByTestId("highcharts-react");
    expect(chart).toBeInTheDocument();
  });

  test("sets chartData correctly based on props", () => {
    render(<Chart data={mockData} chartType="linear" />);
    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);

    expect(options.series[0].data).toEqual([5, 10, 7]);
    expect(options.xAxis.categories).toEqual(["Jan", "Feb", "Mar"]);
    expect(options.yAxis.max).toBe(10);
    expect(options.chart.type).toBe("line");
  });

  test("renders null if data is empty", () => {
    render(<Chart data={[]} chartType="linear" />);
    const chart = screen.getByTestId("highcharts-react");
    const options = JSON.parse(chart.textContent);

    expect(options.series[0].data).toEqual([]);
    expect(options.xAxis.categories).toEqual([]);
  });
});
