import { render, screen } from "@testing-library/react";
import RenderChartCard from "./../RenderChartCard";

// Mock ChartComponent
jest.mock("@/Charts/ChartComponent", () => () => <div data-testid="chart-component" />);

describe("RenderChartCard Component", () => {
  const props = {
    title: "Test Chart",
    chartType: "line",
    categories: ["A", "B", "C"],
    seriesData: [1, 2, 3],
    seriesName: "Series 1",
    loading: false,
  };

  test("renders title correctly", () => {
    render(<RenderChartCard {...props} />);
    expect(screen.getByText("Test Chart")).toBeInTheDocument();
  });

  test("renders loading spinner when loading is true", () => {
    render(<RenderChartCard {...props} loading={true} />);
    expect(screen.getByRole("status")).toBeInTheDocument(); 
  });

  test("renders 'Data not found' when categories is empty", () => {
    render(<RenderChartCard {...props} categories={[]} />);
    expect(screen.getByText("Data not found")).toBeInTheDocument();
  });

  test("renders ChartComponent when data is available and not loading", () => {
    render(<RenderChartCard {...props} />);
    expect(screen.getByTestId("chart-component")).toBeInTheDocument();
  });
});

