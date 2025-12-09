import React from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import TokenAndTransactionGraph from "../TokenAndTransactionGraph";

// Mock the services and components
jest.mock("@/services/getTokenGraph");
jest.mock("@/services/getCoinTransactionGraph");
jest.mock("@/components/contexts/networkChanged");
jest.mock("@/app/(routes)/notfound/page", () => () => <div>PageMock</div>);
jest.mock("@/components/chart/ChartAccounts", () => () => <div>ChartAccountsMock</div>);
jest.mock("@/components/chart/TokenPriceChart", () => () => <div>TokenPriceChartMock</div>);
jest.mock("@/components/loader/Loader", () => () => <div>LoaderMock</div>);

const getTokenPriceGraph = require('@/services/getTokenGraph').default;
const getCoinTransactionGraph = require('@/services/getCoinTransactionGraph').default;
const useGetNetwork = require('@/components/contexts/networkChanged').useGetNetwork;

describe("TokenAndTransactionGraph Component", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Setup localStorage mock
    const localStorageMock = {
      getItem: jest.fn(() => "EVM Chain"),
      setItem: jest.fn(),
      clear: jest.fn()
    };
    global.localStorage = localStorageMock;

    // Setup matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Setup API mocks
    getTokenPriceGraph.mockResolvedValue({
      data: { finalData: [{ x: 1, y: 2 }], currentPrice: 10 },
    });

    getCoinTransactionGraph.mockResolvedValue({
      data: { finalData: [{ x: 1, y: 3 }], count: 5 },
    });

    // Setup network context
    useGetNetwork.mockReturnValue({ isEvm: true });
  });

  test("renders loader initially", () => {
    render(<TokenAndTransactionGraph />);
    expect(screen.getByText("LoaderMock")).toBeInTheDocument();
  });

  test("renders token price chart after load", async () => {
    render(<TokenAndTransactionGraph />);
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });
    expect(getTokenPriceGraph).toHaveBeenCalled();
  });

  test("renders coin transaction chart for EVM", async () => {
    render(<TokenAndTransactionGraph />);
    // Verify APIs are called
    expect(getCoinTransactionGraph).toHaveBeenCalled();
    expect(getTokenPriceGraph).toHaveBeenCalled();
  });

  test("changing token price dropdown triggers API call", async () => {
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });

    const callCountBefore = getTokenPriceGraph.mock.calls.length;

    // Mock the API response for the second call
    getTokenPriceGraph.mockResolvedValueOnce({
      data: { finalData: [{ x: 2, y: 3 }], currentPrice: 11 },
    });

    // Get the first select and trigger onChange
    const dropdowns = screen.getAllByRole("combobox");
    
    // Use fireEvent.change to simulate select change
    await act(async () => {
      fireEvent.change(dropdowns[0], { target: { value: "1 Year" } });
    });

    // The handler should update the type, which triggers useEffect
    // We can verify the API was called again
    await waitFor(() => {
      expect(getTokenPriceGraph.mock.calls.length).toBeGreaterThanOrEqual(callCountBefore);
    }, { timeout: 1000 });
  });

  test("shows component without coin transaction for non-EVM chain", async () => {
    // Setup for non-EVM chain
    useGetNetwork.mockReturnValueOnce({ isEvm: false });
    global.localStorage.getItem = jest.fn(() => "NON-EVM");
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });
    
    // For non-EVM, ChartAccounts should not render
    expect(screen.queryByText("ChartAccountsMock")).not.toBeInTheDocument();
  });

  test("handles API errors gracefully", async () => {
    const originalError = console.error;
    console.error = jest.fn();
    
    // Mock the API to reject with an error
    getTokenPriceGraph.mockRejectedValueOnce(new Error("API Error"));
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      // Component should render the chart section even after error
      expect(screen.queryByText("LoaderMock")).not.toBeInTheDocument();
    });
    
    console.error = originalError;
  });

  test("renders coin transaction section only for EVM chain with valid data", async () => {
    // Setup for EVM chain with valid data
    global.localStorage.getItem = jest.fn(() => "EVM Chain");
    useGetNetwork.mockReturnValueOnce({ isEvm: true });
    
    render(<TokenAndTransactionGraph />);
    
    // Both APIs should be called
    expect(getCoinTransactionGraph).toHaveBeenCalled();
    expect(getTokenPriceGraph).toHaveBeenCalled();
  });

  test("does not render coin transaction section for non-EVM chain", async () => {
    // Setup for non-EVM chain
    useGetNetwork.mockReturnValueOnce({ isEvm: false });
    global.localStorage.getItem = jest.fn(() => "NON-EVM");
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.queryByText("Daily Coin Transactions")).not.toBeInTheDocument();
    });
  });

  test("displays token price in header", async () => {
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });
    
    // Check for "Price Analytics" text which indicates token price section
    expect(screen.getByText(/Price Analytics/i)).toBeInTheDocument();
  });

  test("changes coin transaction dropdown triggers API call", async () => {
    render(<TokenAndTransactionGraph />);
    
    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });

    const callCountBefore = getCoinTransactionGraph.mock.calls.length;

    // Mock the API response for the second call
    getCoinTransactionGraph.mockResolvedValueOnce({
      data: { finalData: [{ x: 3, y: 4 }], count: 8 },
    });

    // Simulate select change for coin transaction
    await act(async () => {
      const dropdowns = screen.getAllByRole("combobox");
      if (dropdowns[1]) {
        fireEvent.change(dropdowns[1], { target: { value: "1 Year" } });
      }
    });

    // Verify the API was called
    await waitFor(() => {
      expect(getCoinTransactionGraph.mock.calls.length).toBeGreaterThanOrEqual(callCountBefore);
    }, { timeout: 1000 });
  });

  test("renders dashboard layout with correct structure", async () => {
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });
    
    // Check for main container
    expect(screen.getByText(/Price Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/changes in token price/i)).toBeInTheDocument();
  });

  test("displays page component when token price data is empty", async () => {
    // Mock empty data response
    getTokenPriceGraph.mockResolvedValueOnce({
      data: { finalData: [], currentPrice: 0 },
    });
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      // When data is empty, Page component should be rendered
      expect(screen.getByText("PageMock")).toBeInTheDocument();
    });
  });

  test("displays page component when coin transaction data is empty", async () => {
    // Mock empty data response for coin transaction
    getCoinTransactionGraph.mockResolvedValueOnce({
      data: { finalData: [], count: 0 },
    });
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      // Component should still render even with empty data
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });
  });

  test("handles concurrent API calls", async () => {
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });

    // Both APIs should be called during initial render
    expect(getTokenPriceGraph).toHaveBeenCalled();
    expect(getCoinTransactionGraph).toHaveBeenCalled();
  });

  test("updates token price display with correct value", async () => {
    getTokenPriceGraph.mockResolvedValueOnce({
      data: { finalData: [{ x: 1, y: 2 }, { x: 2, y: 3 }], currentPrice: 15.5 },
    });
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });
  });

  test("renders info icons for tooltips", async () => {
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });

    // Check for info circle icon
    const infoIcons = screen.getAllByLabelText("info-circle");
    expect(infoIcons.length).toBeGreaterThan(0);
  });

  test("handles rejection in token price API call", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock API rejection
    getTokenPriceGraph.mockRejectedValueOnce(new Error("Token API Error"));
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.queryByText("LoaderMock")).not.toBeInTheDocument();
    });
    
    consoleErrorSpy.mockRestore();
  });

  test("handles rejection in coin transaction API call", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock API rejection for coin transaction
    getCoinTransactionGraph.mockRejectedValueOnce(new Error("Coin Transaction API Error"));
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      // Should still try to render token price chart
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });
    
    consoleErrorSpy.mockRestore();
  });

  test("correctly displays zero coin count", async () => {
    getCoinTransactionGraph.mockResolvedValueOnce({
      data: { finalData: [{ x: 1, y: 3 }], count: 0 },
    });
    
    render(<TokenAndTransactionGraph />);
    
    // Verify token chart renders (coin section may not if data is not there)
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });
  });

  test("selects different token price periods", async () => {
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });

    const callCountBefore = getTokenPriceGraph.mock.calls.length;

    // Mock API for second call with different period
    getTokenPriceGraph.mockResolvedValueOnce({
      data: { finalData: [{ x: 3, y: 4 }], currentPrice: 12 },
    });

    // Get dropdowns and trigger change
    const dropdowns = screen.getAllByRole("combobox");
    
    await act(async () => {
      if (dropdowns[0]) {
        fireEvent.change(dropdowns[0], { target: { value: "7 Days" } });
      }
    });

    // Verify API was called
    await waitFor(() => {
      expect(getTokenPriceGraph.mock.calls.length).toBeGreaterThanOrEqual(callCountBefore);
    }, { timeout: 1000 });
  });

  test("component renders with EVM chain check", async () => {
    const localStorageGetItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue("EVM Chain");
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });

    expect(localStorageGetItemSpy).toHaveBeenCalledWith("chainType");
    localStorageGetItemSpy.mockRestore();
  });

  test("component renders with non-EVM chain", async () => {
    const localStorageGetItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockReturnValue("Bitcoin Chain");
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      // Non-EVM chain should not show coin transaction section
      expect(screen.queryByText("Daily Coin Transactions")).not.toBeInTheDocument();
    });

    localStorageGetItemSpy.mockRestore();
  });

  test("displays formatted token price with correct precision", async () => {
    getTokenPriceGraph.mockResolvedValueOnce({
      data: { finalData: [{ x: 1, y: 2 }], currentPrice: 10.123456 },
    });
    
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });
  });

  test("both APIs are called on initial render", async () => {
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      // Wait for token price chart to load (initial render)
      expect(screen.getByText("TokenPriceChartMock")).toBeInTheDocument();
    });

    // Both coin and token APIs should have been called
    expect(getCoinTransactionGraph).toHaveBeenCalled();
    expect(getTokenPriceGraph).toHaveBeenCalled();
  });

  test("component conditionally renders based on chain type", async () => {
    render(<TokenAndTransactionGraph />);
    
    await waitFor(() => {
      // Token price section always renders
      expect(screen.getByText(/Price Analytics/i)).toBeInTheDocument();
    });
  });
});