import { useState, useCallback, useMemo, useEffect } from "react";
import getTransactions from "@/services/getTransactions";
import {
  InitStatus,
  FetchingStatus,
  SuccessStatus,
  ErrorStatus,
  tableLimit,
} from "@/constant/constant";

export default function useEvmTransactionsNextOnly({
  setTransactionData,
  autoLoad = true,
  networkChangedFlag,
  isEvm,
} = {}) {
  const [meta, setMeta] = useState(null); // response?.data
  const [status, setStatus] = useState(InitStatus);
  const [itemsCount, setItemsCount] = useState(0); // 0 => first page, then 50, 100,...
  const [lastBlockNumber, setLastBlockNumber] = useState(null);

  // Derive page display: 1 for first page, then 1 + itemsCount/50
  const currentPage = useMemo(() => {
    if (itemsCount === 0) return 1;
    return 1 + Math.floor(itemsCount / 50);
  }, [itemsCount]);

  const fetchFirstPage = useCallback(async () => {
    if (!isEvm) return;
    try {
      setStatus(FetchingStatus);
      const response = await getTransactions(
        1,
        tableLimit,
        "/transactions?filter=validated"
      );
      if (response) {
        const items = response?.items ?? [];
        setTransactionData(items);
        setMeta(response?.data ?? null);

        const last = items[items.length - 1];
        setLastBlockNumber(last?.block_number ?? null);

        setItemsCount(0);
        setStatus(SuccessStatus);
      } else {
        setStatus(ErrorStatus);
      }
    } catch (e) {
      setTransactionData([]);
      setMeta(null);
      setStatus(ErrorStatus);
    }
  }, []);
  const fetchNextPage = useCallback(async () => {
    try {
      // This hook is designed for EVM chain endpoint style
      const nextItemsCount = itemsCount === 0 ? 50 : itemsCount + 50;
      if (!lastBlockNumber) {
        // If we don't have a reference yet, reload first page
        await fetchFirstPage();
        return;
      }

      setStatus(FetchingStatus);

      const params = `/transactions?block_number=${encodeURIComponent(
        lastBlockNumber
      )}&index=1&items_count=${encodeURIComponent(
        nextItemsCount
      )}&filter=validated`;

      const response = await getTransactions(1, tableLimit, params);

      if (response) {
        const items = response?.items ?? [];
        setTransactionData(items);
        setMeta(response?.data ?? null);

        const last = items[items.length - 1];
        setLastBlockNumber(last?.block_number ?? lastBlockNumber);

        setItemsCount(nextItemsCount);
        setStatus(SuccessStatus);
      } else {
        setStatus(ErrorStatus);
      }
    } catch (e) {
      setStatus(ErrorStatus);
    }
  }, [itemsCount, lastBlockNumber, fetchFirstPage]);

  // Auto load first page on mount or when network changes
  useEffect(() => {
    if (autoLoad && isEvm) fetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, networkChangedFlag]);

  return {
    // data
    meta,
    // status
    status,
    isLoading: status === InitStatus || status === FetchingStatus,

    // paging state
    itemsCount,
    lastBlockNumber,
    currentPage,

    // actions
    fetchFirstPage,
    fetchNextPage,
  };
}
