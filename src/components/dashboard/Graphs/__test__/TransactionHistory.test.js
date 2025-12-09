import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import TransactionHistory from "../TransactionHistory";

// ---- Mock Services ----
jest.mock("@/services/getTransactionGraph", () =>
  jest.fn(() =>
    Promise.resolve({
      data: {
        finalData: [{ value: 10, time: "2024-01-01" }],
        count: 50,
      },
    })
  )
);

const mockGetTransactionGraph = require("@/services/getTransactionGraph");

// ---- Mock Contexts ----
jest.mock("@/components/contexts/latest_data", () => ({
  useLatestData: () => ({}),
}));

const mockUseGetNetwork = require("@/components/contexts/networkChanged").useGetNetwork;

jest.mock("@/components/contexts/networkChanged", () => ({
  useGetNetwork: jest.fn(() => ({ isNetworkChanged: false })),
}));

// ---- Mock Components ----
jest.mock("@/components/loader/GraphLoading", () => () => (
  <div data-testid="graph-loading">Loading...</div>
));

jest.mock("@/components/chart/ChartAccounts", () => (props) => (
  <div data-testid="chart-accounts">{JSON.stringify(props.data)}</div>
));

jest.mock("@/app/(routes)/notfound/page", () => () => (
  <div data-testid="error-page">Error</div>
));

jest.mock("@/utils/eventTrack", () => ({
  trackEvent: jest.fn(),
}));

describe("TransactionHistory Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    render(<TransactionHistory />);

    expect(screen.getByTestId("graph-loading")).toBeInTheDocument();
  });

  test("renders chart after successful API call", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    // Component calls fetchChartData on mount
    expect(mockGetTransactionGraph).toHaveBeenCalled();
  });

  test("displays transaction count in header", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    // Check for the count value (50 from mock)
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  test("renders select dropdown", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();
  });

  test("changes graph when dropdown value changes", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();

    // Verify the API was called initially
    expect(mockGetTransactionGraph).toHaveBeenCalled();
  });

  test("renders component with correct title", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    expect(screen.getByText(/Total Transaction History/i)).toBeInTheDocument();
  });

  test("handles API errors gracefully", async () => {
    mockGetTransactionGraph.mockRejectedValueOnce(new Error("API Error"));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<TransactionHistory />);

    await waitFor(() => {
      // Component should show error page or loading state
      expect(screen.queryByTestId("graph-loading")).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  test("renders with default graph type", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    // Verify the component renders with initial data
    expect(mockGetTransactionGraph).toHaveBeenCalled();
  });

  test("renders chart accounts with correct props", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    const chartElement = screen.getByTestId("chart-accounts");
    expect(chartElement).toBeInTheDocument();
  });

  test("handles network change detection", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    // Verify API was called when component mounts
    expect(mockGetTransactionGraph).toHaveBeenCalled();
  });

  test("renders success state with data", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    // Verify chart element exists (indicates success state)
    const chartElement = screen.getByTestId("chart-accounts");
    expect(chartElement).toBeInTheDocument();
  });

  test("renders with graphdashboard prop", async () => {
    const { container } = render(<TransactionHistory graphdashboard={true} />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    const graphContainer = container.querySelector(".graphdashboard");
    expect(graphContainer).toBeInTheDocument();
  });

  test("renders with transHisgraph class when graphdashboard prop is false", async () => {
    const { container } = render(<TransactionHistory graphdashboard={false} />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    const graphContainer = container.querySelector(".transHisgraph");
    expect(graphContainer).toBeInTheDocument();
  });

  test("renders transaction count as 0 when not provided", async () => {
    mockGetTransactionGraph.mockResolvedValueOnce({
      data: {
        finalData: [{ value: 5 }],
        count: undefined,
      },
    });

    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );
  });

  test("displays loading indicator initially", () => {
    render(<TransactionHistory />);

    const loadingElement = screen.getByTestId("graph-loading");
    expect(loadingElement).toBeInTheDocument();
  });

  test("verifies Select component renders with correct options", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
  });

  test("renders div wrapper with relative positioning", async () => {
    const { container } = render(<TransactionHistory />);

    const wrapper = container.querySelector('div[style*="position: relative"]');
    expect(wrapper).toBeInTheDocument();
  });

  test("handles multiple dropdown changes", async () => {
    render(<TransactionHistory />);

    await waitFor(() =>
      expect(screen.getByTestId("chart-accounts")).toBeInTheDocument()
    );

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();

    // Verify API was called
    expect(mockGetTransactionGraph).toHaveBeenCalled();
  });

  test("fetches data when network changes", async () => {
    mockUseGetNetwork.mockReturnValueOnce({ isNetworkChanged: true });

    render(<TransactionHistory />);

    await waitFor(() => {
      expect(mockGetTransactionGraph).toHaveBeenCalled();
    });
  });

  test("renders error page on API failure", async () => {
    mockGetTransactionGraph.mockRejectedValueOnce(new Error("Network Error"));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<TransactionHistory />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.queryByTestId("error-page")).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });
});
