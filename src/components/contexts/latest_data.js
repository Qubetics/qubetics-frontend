"use client";
import {
  EXPLORER_SOCKET_URL,
  NEW_EXPLORER_SOCKET_URL,
  NATIVE_EXPLORER_SOCKET_URL,
} from "@/constant/constant";
import { createContext, useContext, useEffect, useState } from "react";
import {
  initEvmSocket,
  initNativeSocket,
  subscribeAnalytics,
  disconnectEvmSocket,
  subscribeNativeBlocks,
  disconnectNativeSocket,
  subscribeOnChainMetrics,
  subscribeNativeAnalytics,
  subscribeTransactionGraph,
  subscribeNativeChainMetrics,
  subscribeNativeTransactionGraph,
  subscribeNativeLatestTransaction,
} from "../../utils/wsClient";
import {
  initBlocksWebSocket,
  subscribeBlocksNewBlock,
  subscribeTransactionReceived,
} from "@/utils/WsPhoenixClient";

let evmWebSocketUrl = EXPLORER_SOCKET_URL;
let nativeWebSocketUrl = NATIVE_EXPLORER_SOCKET_URL;
let newEvmWebSocketUrl = NEW_EXPLORER_SOCKET_URL;

export const LatestDataContext = createContext();

export function LatestDataProvider({ children }) {
  const [blocks, setBlocks] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [tokensGraph, setTokensGraph] = useState([]);
  const [isPageShown, setPageShown] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [onChainMetric, setOnChainMetric] = useState([]);
  const [transferGraph, setTransferGraph] = useState([]);
  const [accountsGraph, setAccountsGraph] = useState([]);
  const [contractsGraph, setContractsGraph] = useState([]);
  const [transactionGraph, setTransactionGraph] = useState([]);

  let currentChain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  if (currentChain === null || currentChain === undefined) {
    currentChain = "EVM Chain";
  }
  useEffect(() => {
    SubscribeToSocket();
  }, [currentChain]);

  useEffect(() => {
    return () => {
      disconnectEvmSocket();
      disconnectNativeSocket();
    };
  }, [currentChain]);
  const SubscribeToSocket = async () => {
    if (currentChain === "EVM Chain") {
      disconnectNativeSocket();
      await initEvmSocket(evmWebSocketUrl);
      await initBlocksWebSocket(newEvmWebSocketUrl);
      // subscribeLatestBlocks((data) => setBlocks(data));
      subscribeBlocksNewBlock((data) => setBlocks(data));

      subscribeOnChainMetrics((data) => setOnChainMetric(data));
      subscribeTransactionReceived((data) => setTransactions(data));
      // subscribeLatestContractsGraph((data) => setContractsGraph(data));
      // subscribeCoinTransferGraph((data) => setTransferGraph(data));
      subscribeTransactionGraph((data) => setTransactionGraph(data));
      // subscribeAccountsGraph((data) => setAccountsGraph(data));
      // subscribeTokensGraph((data) => setTokensGraph(data));
      subscribeAnalytics((data) => setAnalytics(data));
    } else if (currentChain === "Native Chain") {
      disconnectEvmSocket();
      await initNativeSocket(nativeWebSocketUrl);
      subscribeNativeBlocks((data) => setBlocks(data));
      subscribeNativeChainMetrics((data) => setOnChainMetric(data));
      subscribeNativeLatestTransaction((data) => setTransactions(data));
      subscribeNativeTransactionGraph((data) => setTransactionGraph(data));
      subscribeNativeAnalytics((data) => setAnalytics(data));
    }
  };
  return (
    <LatestDataContext.Provider
      value={{
        blocks,
        analytics,
        tokensGraph,
        isPageShown,
        transactions,
        setPageShown,
        onChainMetric,
        accountsGraph,
        transferGraph,
        contractsGraph,
        transactionGraph,
      }}
    >
      {children}
    </LatestDataContext.Provider>
  );
}

export const useLatestData = () => useContext(LatestDataContext);
