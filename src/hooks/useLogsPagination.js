import { useState, useCallback, useMemo, useEffect } from "react";
import {
  InitStatus,
  FetchingStatus,
  SuccessStatus,
  ErrorStatus,
  tableLimit,
} from "@/constant/constant";
import { NEW_EXPLORER_API_URL } from "@/constant/constant";

export default function useEvmTransactionLogsNextOnly({
  updateTx,
  autoLoad = true,
  isEvm,
} = {}) {
  const [logsData, setLogsData] = useState([]);
  const [topics, setTopics] = useState([]);

  const [meta, setMeta] = useState(null); // response?.data
  const [status, setStatus] = useState(InitStatus);
  const [itemsCount, setItemsCount] = useState(0); // 0 => first page, then 50, 100,...
  const [lastBlockNumber, setLastBlockNumber] = useState(null);
  const [lastLogIndex, setLastLogIndex] = useState(null);

  // Derive page display: 1 for first page, then 1 + itemsCount/50
  const currentPage = useMemo(() => {
    if (itemsCount === 0) return 1;
    return 1 + Math.floor(itemsCount / 50);
  }, [itemsCount]);

  const fetchLogsData = useCallback(async (params) => {
    try {
      const response = await fetch(`${NEW_EXPLORER_API_URL}${params}`);
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const fetchFirstPage = useCallback(async () => {
    if (!updateTx) {
      setStatus(ErrorStatus);
      return;
    }

    try {
      setStatus(FetchingStatus);
      const response = await fetchLogsData(`/transactions/${updateTx}/logs`);

      if (response) {
        const items = response?.items ?? [];
        setLogsData(items);
        setTopics(items[0]?.topics);
        setMeta(response?.data ?? null);

        const last = items[items.length - 1];
        setLastBlockNumber(last?.block_number ?? null);
        setLastLogIndex(last?.index ?? null);

        setItemsCount(0);
        setStatus(SuccessStatus);
      } else {
        setStatus(ErrorStatus);
      }
    } catch (e) {
      setLogsData([]);
      setMeta(null);
      setStatus(ErrorStatus);
    }
  }, [updateTx, fetchLogsData]);

  const fetchNextPage = useCallback(async () => {
    if (!updateTx) return;

    try {
      const nextItemsCount = itemsCount === 0 ? 50 : itemsCount + 50;

      if (!lastBlockNumber || lastLogIndex === null) {
        // If we don't have a reference yet, reload first page
        await fetchFirstPage();
        return;
      }

      setStatus(FetchingStatus);

      const params = `/transactions/${updateTx}/logs?block_number=${encodeURIComponent(
        lastBlockNumber
      )}&index=${encodeURIComponent(
        lastLogIndex
      )}&items_count=${encodeURIComponent(nextItemsCount)}`;

      const response = await fetchLogsData(params);

      if (response) {
        const items = response?.items ?? [];
        setLogsData(items);
        setTopics(items[0]?.topics);
        setMeta(response?.data ?? null);

        const last = items[items.length - 1];
        setLastBlockNumber(last?.block_number ?? lastBlockNumber);
        setLastLogIndex(last?.index ?? lastLogIndex);

        setItemsCount(nextItemsCount);
        setStatus(SuccessStatus);
      } else {
        setStatus(ErrorStatus);
      }
    } catch (e) {
      setStatus(ErrorStatus);
    }
  }, [
    updateTx,
    itemsCount,
    lastBlockNumber,
    lastLogIndex,
    fetchFirstPage,
    fetchLogsData,
  ]);

  // Auto load first page on mount or when network/updateTx changes
  useEffect(() => {
    if (isEvm && autoLoad && updateTx) fetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, updateTx]);

  return {
    // data
    logsData,
    meta,
    topics,

    // status
    status,
    isLoading: status === InitStatus || status === FetchingStatus,

    // paging state
    itemsCount,
    lastBlockNumber,
    lastLogIndex,
    currentPage,

    // actions
    fetchFirstPage,
    fetchNextPage,
  };
}
