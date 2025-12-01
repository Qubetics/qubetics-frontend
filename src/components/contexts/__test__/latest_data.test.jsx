import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { LatestDataProvider, useLatestData } from "../latest_data";
import {
  initEvmSocket,
  initNativeSocket,
  disconnectEvmSocket,
  disconnectNativeSocket,
  subscribeLatestBlocks,
  subscribeLatestTransaction,
  subscribeOnChainMetrics,
  subscribeTransactionGraph,
  subscribeAnalytics,
  subscribeNativeBlocks,
  subscribeNativeLatestTransaction,
  subscribeNativeChainMetrics,
  subscribeNativeTransactionGraph,
  subscribeNativeAnalytics,
} from "../../../utils/wsClient";

// Mock the wsClient module
jest.mock("../../../utils/wsClient", () => ({
  initEvmSocket: jest.fn(),
  initNativeSocket: jest.fn(),
  disconnectEvmSocket: jest.fn(),
  disconnectNativeSocket: jest.fn(),
  subscribeLatestBlocks: jest.fn(),
  subscribeLatestTransaction: jest.fn(),
  subscribeOnChainMetrics: jest.fn(),
  subscribeTransactionGraph: jest.fn(),
  subscribeAnalytics: jest.fn(),
  subscribeNativeBlocks: jest.fn(),
  subscribeNativeLatestTransaction: jest.fn(),
  subscribeNativeChainMetrics: jest.fn(),
  subscribeNativeTransactionGraph: jest.fn(),
  subscribeNativeAnalytics: jest.fn(),
}));

// Mock constants
jest.mock("@/constant/constant", () => ({
  EXPLORER_SOCKET_URL: "ws://evm-socket-url",
  NATIVE_EXPLORER_SOCKET_URL: "ws://native-socket-url",
}));

// Test component to consume context
const TestConsumer = () => {
  const context = useLatestData();
  return (
    <div>
      <div data-testid="blocks">{JSON.stringify(context.blocks)}</div>
      <div data-testid="transactions">{JSON.stringify(context.transactions)}</div>
      <div data-testid="isPageShown">{String(context.isPageShown)}</div>
      <div data-testid="contractsGraph">{JSON.stringify(context.contractsGraph)}</div>
      <div data-testid="transactionGraph">{JSON.stringify(context.transactionGraph)}</div>
      <div data-testid="transferGraph">{JSON.stringify(context.transferGraph)}</div>
      <div data-testid="accountsGraph">{JSON.stringify(context.accountsGraph)}</div>
      <div data-testid="tokensGraph">{JSON.stringify(context.tokensGraph)}</div>
      <div data-testid="analytics">{JSON.stringify(context.analytics)}</div>
      <div data-testid="onChainMetric">{JSON.stringify(context.onChainMetric)}</div>
    </div>
  );
};

describe("LatestDataProvider", () => {
  let getItemMock;

  beforeAll(() => {
    // Mock localStorage
    getItemMock = jest.fn();
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: getItemMock,
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Default to EVM Chain
    getItemMock.mockReturnValue("EVM Chain");
  });

  describe("Context Provider", () => {
    test("provides initial state values", () => {
      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      expect(screen.getByTestId("blocks").textContent).toBe("[]");
      expect(screen.getByTestId("transactions").textContent).toBe("[]");
      expect(screen.getByTestId("isPageShown").textContent).toBe("false");
      expect(screen.getByTestId("contractsGraph").textContent).toBe("[]");
      expect(screen.getByTestId("transactionGraph").textContent).toBe("[]");
      expect(screen.getByTestId("transferGraph").textContent).toBe("[]");
      expect(screen.getByTestId("accountsGraph").textContent).toBe("[]");
      expect(screen.getByTestId("tokensGraph").textContent).toBe("[]");
      expect(screen.getByTestId("analytics").textContent).toBe("[]");
      expect(screen.getByTestId("onChainMetric").textContent).toBe("[]");
    });

    test("renders children correctly", () => {
      render(
        <LatestDataProvider>
          <div data-testid="child">Test Child</div>
        </LatestDataProvider>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByTestId("child").textContent).toBe("Test Child");
    });
  });

  describe("EVM Chain Socket Initialization", () => {
    test("initializes EVM socket when chainType is 'EVM Chain'", async () => {
      getItemMock.mockReturnValue("EVM Chain");

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(disconnectNativeSocket).toHaveBeenCalled();
        expect(initEvmSocket).toHaveBeenCalledWith("ws://evm-socket-url");
      });
    });

    test("subscribes to EVM socket events", async () => {
      getItemMock.mockReturnValue("EVM Chain");

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(subscribeLatestBlocks).toHaveBeenCalled();
        expect(subscribeOnChainMetrics).toHaveBeenCalled();
        expect(subscribeLatestTransaction).toHaveBeenCalled();
        expect(subscribeTransactionGraph).toHaveBeenCalled();
        expect(subscribeAnalytics).toHaveBeenCalled();
      });
    });

    test("updates blocks state when EVM blocks data is received", async () => {
      getItemMock.mockReturnValue("EVM Chain");
      
      let blocksCallback;
      subscribeLatestBlocks.mockImplementation((callback) => {
        blocksCallback = callback;
      });

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(subscribeLatestBlocks).toHaveBeenCalled();
      });

      const mockBlocks = [{ blockNumber: 1, hash: "0x123" }];
      blocksCallback(mockBlocks);

      await waitFor(() => {
        expect(screen.getByTestId("blocks").textContent).toBe(JSON.stringify(mockBlocks));
      });
    });

    test("updates transactions state when EVM transactions data is received", async () => {
      getItemMock.mockReturnValue("EVM Chain");
      
      let transactionsCallback;
      subscribeLatestTransaction.mockImplementation((callback) => {
        transactionsCallback = callback;
      });

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(subscribeLatestTransaction).toHaveBeenCalled();
      });

      const mockTransactions = [{ txHash: "0xabc", from: "0x123" }];
      transactionsCallback(mockTransactions);

      await waitFor(() => {
        expect(screen.getByTestId("transactions").textContent).toBe(JSON.stringify(mockTransactions));
      });
    });

    test("updates onChainMetric state when EVM metrics data is received", async () => {
      getItemMock.mockReturnValue("EVM Chain");
      
      let metricsCallback;
      subscribeOnChainMetrics.mockImplementation((callback) => {
        metricsCallback = callback;
      });

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(subscribeOnChainMetrics).toHaveBeenCalled();
      });

      const mockMetrics = [{ metric: "value" }];
      metricsCallback(mockMetrics);

      await waitFor(() => {
        expect(screen.getByTestId("onChainMetric").textContent).toBe(JSON.stringify(mockMetrics));
      });
    });

    test("updates transactionGraph state when EVM transaction graph data is received", async () => {
      getItemMock.mockReturnValue("EVM Chain");
      
      let graphCallback;
      subscribeTransactionGraph.mockImplementation((callback) => {
        graphCallback = callback;
      });

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(subscribeTransactionGraph).toHaveBeenCalled();
      });

      const mockGraph = [{ timestamp: 123, count: 10 }];
      graphCallback(mockGraph);

      await waitFor(() => {
        expect(screen.getByTestId("transactionGraph").textContent).toBe(JSON.stringify(mockGraph));
      });
    });

    test("updates analytics state when EVM analytics data is received", async () => {
      getItemMock.mockReturnValue("EVM Chain");
      
      let analyticsCallback;
      subscribeAnalytics.mockImplementation((callback) => {
        analyticsCallback = callback;
      });

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(subscribeAnalytics).toHaveBeenCalled();
      });

      const mockAnalytics = [{ data: "analytics" }];
      analyticsCallback(mockAnalytics);

      await waitFor(() => {
        expect(screen.getByTestId("analytics").textContent).toBe(JSON.stringify(mockAnalytics));
      });
    });
  });

  describe("Native Chain Socket Initialization", () => {
    test("initializes Native socket when chainType is 'Native Chain'", async () => {
      getItemMock.mockReturnValue("Native Chain");

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(disconnectEvmSocket).toHaveBeenCalled();
        expect(initNativeSocket).toHaveBeenCalledWith("ws://native-socket-url");
      });
    });

    test("subscribes to Native socket events", async () => {
      getItemMock.mockReturnValue("Native Chain");

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(subscribeNativeBlocks).toHaveBeenCalled();
        expect(subscribeNativeChainMetrics).toHaveBeenCalled();
        expect(subscribeNativeLatestTransaction).toHaveBeenCalled();
        expect(subscribeNativeTransactionGraph).toHaveBeenCalled();
        expect(subscribeNativeAnalytics).toHaveBeenCalled();
      });
    });

    test("updates blocks state when Native blocks data is received", async () => {
      getItemMock.mockReturnValue("Native Chain");
      
      let blocksCallback;
      subscribeNativeBlocks.mockImplementation((callback) => {
        blocksCallback = callback;
      });

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(subscribeNativeBlocks).toHaveBeenCalled();
      });

      const mockBlocks = [{ blockNumber: 2, hash: "0x456" }];
      blocksCallback(mockBlocks);

      await waitFor(() => {
        expect(screen.getByTestId("blocks").textContent).toBe(JSON.stringify(mockBlocks));
      });
    });

    test("updates transactions state when Native transactions data is received", async () => {
      getItemMock.mockReturnValue("Native Chain");
      
      let transactionsCallback;
      subscribeNativeLatestTransaction.mockImplementation((callback) => {
        transactionsCallback = callback;
      });

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(subscribeNativeLatestTransaction).toHaveBeenCalled();
      });

      const mockTransactions = [{ txHash: "0xdef", from: "0x789" }];
      transactionsCallback(mockTransactions);

      await waitFor(() => {
        expect(screen.getByTestId("transactions").textContent).toBe(JSON.stringify(mockTransactions));
      });
    });
  });

  describe("Default Chain Handling", () => {
    test("defaults to 'EVM Chain' when localStorage returns null", async () => {
      getItemMock.mockReturnValue(null);

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(disconnectNativeSocket).toHaveBeenCalled();
        expect(initEvmSocket).toHaveBeenCalledWith("ws://evm-socket-url");
      });
    });

    test("defaults to 'EVM Chain' when localStorage returns undefined", async () => {
      getItemMock.mockReturnValue(undefined);

      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      await waitFor(() => {
        expect(disconnectNativeSocket).toHaveBeenCalled();
        expect(initEvmSocket).toHaveBeenCalledWith("ws://evm-socket-url");
      });
    });
  });

  describe("Cleanup", () => {
    test("disconnects both sockets on unmount", () => {
      const { unmount } = render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      unmount();

      expect(disconnectEvmSocket).toHaveBeenCalled();
      expect(disconnectNativeSocket).toHaveBeenCalled();
    });
  });

  describe("useLatestData Hook", () => {
    test("throws error when used outside provider", () => {
      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<TestConsumer />);
      }).toThrow();

      console.error = originalError;
    });

    test("returns context value when used inside provider", () => {
      render(
        <LatestDataProvider>
          <TestConsumer />
        </LatestDataProvider>
      );

      expect(screen.getByTestId("blocks")).toBeInTheDocument();
      expect(screen.getByTestId("transactions")).toBeInTheDocument();
      expect(screen.getByTestId("isPageShown")).toBeInTheDocument();
    });
  });
});
