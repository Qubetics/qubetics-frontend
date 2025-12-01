import { render, screen, waitFor } from "@testing-library/react";
import ChainAbstractionAnalytics from "./../ChainAbstractionAnalytics";

// Mock the API services
import getOnChainAnalyticsChart from "@/services/getOnChainAnalyticsChart";
import getLoadOverTimeChart from "@/services/getLoadOverTimeChart";
import getDailyActiveUserChart from "@/services/getDailyActiveUserChart";

// Mock RenderChartCard to avoid rendering actual chart library
jest.mock("./../RenderChartCard", () => ({ title, loading }) => (
  <div data-testid={`chart-${title}`}>
    {loading ? "Loading..." : title}
  </div>
));

// Mock API calls
jest.mock("@/services/getOnChainAnalyticsChart");
jest.mock("@/services/getLoadOverTimeChart");
jest.mock("@/services/getDailyActiveUserChart");

describe("ChainAbstractionAnalytics Component", () => {
  beforeEach(() => {
    getOnChainAnalyticsChart.mockResolvedValue({
      data: [
        { target_chain: "Ethereum", count: 10 },
        { target_chain: "Polygon", count: 5 },
      ],
    });

    getLoadOverTimeChart.mockResolvedValue({
      data: [
        { date: "2025-11-01", count: 100 },
        { date: "2025-11-02", count: 150 },
      ],
    });

    getDailyActiveUserChart.mockResolvedValue({
      data: [
        { date: "2025-11-01", count: 50 },
        { date: "2025-11-02", count: 75 },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    render(<ChainAbstractionAnalytics />);
    
    expect(screen.getByTestId("chart-Transaction load / day")).toHaveTextContent("Loading...");
    expect(screen.getByTestId("chart-Intent settlement")).toHaveTextContent("Loading...");
    expect(screen.getByTestId("chart-Active users / day")).toHaveTextContent("Loading...");
  });

  test("renders charts after fetching data", async () => {
    render(<ChainAbstractionAnalytics />);

    // Wait for async data to load
    await waitFor(() => {
      expect(screen.getByTestId("chart-Transaction load / day")).toHaveTextContent("Transaction load / day");
      expect(screen.getByTestId("chart-Intent settlement")).toHaveTextContent("Intent settlement");
      expect(screen.getByTestId("chart-Active users / day")).toHaveTextContent("Active users / day");
    });
  });

  test("calls all API services once", async () => {
    render(<ChainAbstractionAnalytics />);
    
    await waitFor(() => {
      expect(getOnChainAnalyticsChart).toHaveBeenCalledTimes(1);
      expect(getLoadOverTimeChart).toHaveBeenCalledTimes(1);
      expect(getDailyActiveUserChart).toHaveBeenCalledTimes(1);
    });
  });
});
