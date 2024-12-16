"use client";
import {
  EXPLORER_SOCKET_URL,
  NATIVE_EXPLORER_SOCKET_URL,
} from "@/constant/constant";
import { createContext, useContext, useEffect, useState } from "react";
import {
  disconnectEvmSocket,
  disconnectNativeSocket,
  initEvmSocket,
  initNativeSocket,
  subscribeAnalytics,
  subscribeLatestBlocks,
  subscribeLatestTransaction,
  subscribeNativeAnalytics,
  subscribeNativeBlocks,
  subscribeNativeChainMetrics,
  subscribeNativeLatestTransaction,
  subscribeNativeTransactionGraph,
  subscribeOnChainMetrics,
  subscribeTransactionGraph,
} from "../../utils/wsClient";

let evmWebSocketUrl = EXPLORER_SOCKET_URL;
let nativeWebSocketUrl = NATIVE_EXPLORER_SOCKET_URL;

export const LatestDataContext = createContext();

export function LatestDataProvider({ children }) {
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isPageShown, setPageShown] = useState(false);
  const [contractsGraph, setContractsGraph] = useState([]);
  const [accountsGraph, setAccountsGraph] = useState([]);
  const [transactionGraph, setTransactionGraph] = useState([]);
  const [transferGraph, setTransferGraph] = useState([]);
  const [tokensGraph, setTokensGraph] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [onChainMetric, setOnChainMetric] = useState([]);
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
      subscribeLatestBlocks((data) => setBlocks(data));
      subscribeOnChainMetrics((data) => setOnChainMetric(data));
      subscribeLatestTransaction((data) => setTransactions(data));
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
        setPageShown,
        isPageShown,
        transactions,
        contractsGraph,
        transactionGraph,
        transferGraph,
        accountsGraph,
        tokensGraph,
        analytics,
        onChainMetric,
      }}
    >
      {children}
    </LatestDataContext.Provider>
  );
}

export const useLatestData = () => useContext(LatestDataContext);
