import { render, waitFor } from "@testing-library/react";
import AnalyticToken from "./AnalyticToken";
import getAnalyticsGraph from "@/services/getAnalyticsGraph";

// Mock the API
jest.mock("@/services/getAnalyticsGraph");

// We'll capture props every time AnalyticGraph renders
var mockRenderedProps = [];
jest.mock("../AnalyticGraph/AnalyticGraph", () => {
  return function MockAnalyticGraph(props) {
    mockRenderedProps.push(props);
    return <div data-testid="analytic-graph" />;
  };
});

describe("AnalyticToken Component", () => {
  const mockAddress = "0xABC";

  beforeEach(() => {
    mockRenderedProps = [];
    jest.clearAllMocks();
  });

  test("handles API error by generating dummy data", async () => {
    getAnalyticsGraph.mockResolvedValueOnce({ error: true });

    render(<AnalyticToken address={mockAddress} />);

    await waitFor(() => {
      // Grab the latest render's props
      const latestProps = mockRenderedProps[mockRenderedProps.length - 1];
      expect(latestProps).toBeDefined();
      expect(latestProps.apiData).toHaveLength(100);
      expect(latestProps.apiData[0].count.transferAmount).toBe(0);
    });
  });

  test("handles API response with error field by generating dummy data", async () => {
    getAnalyticsGraph.mockResolvedValueOnce({ error: true });

    render(<AnalyticToken address={mockAddress} />);

    await waitFor(() => {
      const latestProps = mockRenderedProps[mockRenderedProps.length - 1];
      expect(latestProps).toBeDefined();
      expect(latestProps.apiData).toHaveLength(100);
      expect(latestProps.apiData[99].count.transferAmount).toBe(0);
    });
  });

  test("updates graphData when API returns valid data", async () => {
    const apiData = [
      { createdAt: 1, count: { transferAmount: 5, transferCount: 2 } },
      { createdAt: 2, count: { transferAmount: 10, transferCount: 4 } },
    ];

    getAnalyticsGraph.mockResolvedValueOnce({ data: { finalData: apiData } });

    render(<AnalyticToken address={mockAddress} />);

    await waitFor(() => {
      const latestProps = mockRenderedProps[mockRenderedProps.length - 1];
      expect(latestProps).toBeDefined();
      expect(latestProps.apiData).toEqual(apiData);
    });
  });
});
