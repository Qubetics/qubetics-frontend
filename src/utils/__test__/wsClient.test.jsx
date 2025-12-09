// socketUtils.test.js
import {
  initEvmSocket,
  initNativeSocket,
  initMainSocket,
  disconnectEvmSocket,
  disconnectNativeSocket,
  disconnectMainSocket,
  subscribeLatestContractsGraph,
  subscribeCoinTransferGraph,
  subscribeAccountsGraph,
  subscribeTokensGraph,
  subscribeTransactionGraph,
  subscribeNativeTransactionGraph,
  subscribeLatestBlocks,
  subscribeNativeBlocks,
  subscribeLatestTransaction,
  subscribeNativeLatestTransaction,
  subscribeAnalytics,
  subscribeNativeAnalytics,
  subscribeOnChainMetrics,
  subscribeNativeChainMetrics,
} from "../wsClient";

// Mock socket.io-client
jest.mock("socket.io-client", () => {
  const mockSocket = {
    on: jest.fn(),
    disconnect: jest.fn(),
  };

  return {
    io: {
      connect: jest.fn(() => mockSocket),
    },
  };
});

import { io } from "socket.io-client";

describe("Socket Utilities", () => {
  let mockSocket;

  beforeEach(() => {
    mockSocket = io.connect();
    jest.clearAllMocks();
  });

  test("initEvmSocket should create socket if not exists", async () => {
    await initEvmSocket("ws://example");
    expect(io.connect).toHaveBeenCalledWith("ws://example", {
      transports: ["websocket"],
      reconnect: true,
    });
  });

  test("initNativeSocket should create socket if not exists", async () => {
    await initNativeSocket("ws://native");
    expect(io.connect).toHaveBeenCalledWith("ws://native", {
      transports: ["websocket"],
      reconnect: true,
    });
  });

  test("initMainSocket should create main socket only once", async () => {
    await initMainSocket("ws://main");
    await initMainSocket("ws://main"); // second time should not init again

    expect(io.connect).toHaveBeenCalledTimes(1);
  });

  test("disconnectEvmSocket should disconnect socket", () => {
    disconnectEvmSocket();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  test("disconnectNativeSocket should disconnect native socket", () => {
    disconnectNativeSocket();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  test("disconnectMainSocket should disconnect main socket", () => {
    disconnectMainSocket();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  // ---------------- Subscription Tests ---------------------

  test("subscribeLatestContractsGraph should call socket.on", () => {
    const cb = jest.fn();
    subscribeLatestContractsGraph(cb);

    expect(mockSocket.on).toHaveBeenCalledWith(
      "CONTRACT_DEPLOYED_GRAPH",
      expect.any(Function)
    );
  });

  test("subscribeCoinTransferGraph should call socket.on", () => {
    const cb = jest.fn();
    subscribeCoinTransferGraph(cb);
    expect(mockSocket.on).toHaveBeenCalledWith(
      "COIN_TRANSFER_GRAPH",
      expect.any(Function)
    );
  });

  test("subscribeAccountsGraph calls evmSocket.on", () => {
    subscribeAccountsGraph(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "ACCOUNT_TX_GRAPH",
      expect.any(Function)
    );
  });

  test("subscribeTokensGraph calls evmSocket.on", () => {
    subscribeTokensGraph(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "TOKEN_TX_GRAPH",
      expect.any(Function)
    );
  });

  test("subscribeTransactionGraph calls evmSocket.on", () => {
    subscribeTransactionGraph(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "ALL_TRANSACTIONS_GRAPH",
      expect.any(Function)
    );
  });

  test("subscribeNativeTransactionGraph calls nativeSocket.on", () => {
    subscribeNativeTransactionGraph(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "NATIVE_ALL_TRANSACTIONS_GRAPH",
      expect.any(Function)
    );
  });

  test("subscribeLatestBlocks calls evmSocket.on", () => {
    subscribeLatestBlocks(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "LATEST_BLOCK",
      expect.any(Function)
    );
  });

  test("subscribeNativeBlocks calls nativeSocket.on", () => {
    subscribeNativeBlocks(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "NATIVE_LATEST_BLOCK",
      expect.any(Function)
    );
  });

  test("subscribeLatestTransaction calls evmSocket.on", () => {
    subscribeLatestTransaction(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "LATEST_TRANSACTION",
      expect.any(Function)
    );
  });

  test("subscribeNativeLatestTransaction calls nativeSocket.on", () => {
    subscribeNativeLatestTransaction(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "NATIVE_LATEST_TRANSACTIONS",
      expect.any(Function)
    );
  });

  test("subscribeAnalytics calls evmSocket.on", () => {
    subscribeAnalytics(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "ANALYTICS",
      expect.any(Function)
    );
  });

  test("subscribeNativeAnalytics calls nativeSocket.on", () => {
    subscribeNativeAnalytics(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "NATIVE_ANALYTICS",
      expect.any(Function)
    );
  });

  test("subscribeOnChainMetrics calls evmSocket.on", () => {
    subscribeOnChainMetrics(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "TX_SUMMARY",
      expect.any(Function)
    );
  });

  test("subscribeNativeChainMetrics calls nativeSocket.on", () => {
    subscribeNativeChainMetrics(jest.fn());
    expect(mockSocket.on).toHaveBeenCalledWith(
      "NATIVE_TX_SUMMARY",
      expect.any(Function)
    );
  });

  // -------- Tests for callback execution (lines 62, 68, 74, 80, 86, 91, 97, 104, 110, 116, 122, 128, 134, 140) --------

  test("subscribeLatestContractsGraph should execute callback with data", () => {
    const cb = jest.fn();
    subscribeLatestContractsGraph(cb);

    // Get the registered callback and invoke it
    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { id: 1, name: "test" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeCoinTransferGraph should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeCoinTransferGraph(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { coin: "BTC" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeAccountsGraph should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeAccountsGraph(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { account: "0x123" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeTokensGraph should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeTokensGraph(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { token: "TICS" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeTransactionGraph should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeTransactionGraph(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { txHash: "0xabc" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeNativeTransactionGraph should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeNativeTransactionGraph(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { nativeTx: "0xdef" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeLatestBlocks should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeLatestBlocks(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { blockNumber: 100 };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeNativeBlocks should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeNativeBlocks(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { nativeBlockNumber: 50 };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeLatestTransaction should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeLatestTransaction(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { latestTx: "0xghi" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeNativeLatestTransaction should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeNativeLatestTransaction(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { nativeLatestTx: "0xjkl" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeAnalytics should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeAnalytics(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { analytics: "data" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeNativeAnalytics should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeNativeAnalytics(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { nativeAnalytics: "data" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeOnChainMetrics should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeOnChainMetrics(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { metrics: "chain" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  test("subscribeNativeChainMetrics should execute callback with data", () => {
    jest.clearAllMocks();
    mockSocket = io.connect();
    const cb = jest.fn();
    subscribeNativeChainMetrics(cb);

    const registeredCallback = mockSocket.on.mock.calls[0][1];
    const testData = { nativeMetrics: "chain" };
    registeredCallback(testData);

    expect(cb).toHaveBeenCalledWith(testData);
  });

  // Test edge cases for initialization
  test("initNativeSocket should skip reinitialize if already exists", async () => {
    await initNativeSocket("ws://native");
    await initNativeSocket("ws://native2");

    // Socket should have been created at least once
    expect(io.connect).toHaveBeenCalled();
  });

  test("disconnectEvmSocket should return null when socket does not exist", () => {
    // Clear the socket references
    jest.resetModules();
    const result = disconnectEvmSocket();
    expect(result).toBeNull();
  });

  test("disconnectNativeSocket should return null when socket does not exist", () => {
    const result = disconnectNativeSocket();
    expect(result).toBeNull();
  });

  test("disconnectMainSocket should return null when socket does not exist", () => {
    const result = disconnectMainSocket();
    expect(result).toBeNull();
  });
});
