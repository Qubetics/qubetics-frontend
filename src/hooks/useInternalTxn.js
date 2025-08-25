import { useState, useCallback, useMemo, useEffect } from "react";
import {
  InitStatus,
  FetchingStatus,
  SuccessStatus,
  ErrorStatus,
  tableLimit,
} from "@/constant/constant";
import { NEW_EXPLORER_API_URL } from "@/constant/constant";

export default function useEvmTransactionInternalTxsNextOnly({
  updateTx,
  autoLoad = true,
  isEvm,
} = {}) {
  const [internalTxns, setInternalTxsData] = useState([]);
  const [intMeta, setMeta] = useState(null); // response?.data
  const [intStatus, setStatus] = useState(InitStatus);
  const [intItemsCount, setItemsCount] = useState(0); // 0 => first page, then 50, 100,...
  const [lastBlockNumber, setLastBlockNumber] = useState(null);
  const [lastTxIndex, setLastTxIndex] = useState(null);
  const [lastIndex, setLastIndex] = useState(null);

  // Derive page display: 1 for first page, then 1 + itemsCount/50
  const intCurrentPage = useMemo(() => {
    if (intItemsCount === 0) return 1;
    return 1 + Math.floor(intItemsCount / 50);
  }, [intItemsCount]);

  const fetchInternalTxsData = useCallback(async (params) => {
    try {
      const response = await fetch(`${NEW_EXPLORER_API_URL}${params}`);
      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  }, []);

  const intFetchFirstPage = useCallback(async () => {
    if (!updateTx) {
      setStatus(ErrorStatus);
      return;
    }

    try {
      setStatus(FetchingStatus);
      const response = await fetchInternalTxsData(
        `/transactions/${updateTx}/internal-transactions`
      );

      if (response) {
        const items = response?.items ?? [];
        setInternalTxsData(items);
        setMeta(response?.data ?? null);

        const last = items[items.length - 1];
        setLastBlockNumber(last?.block_number ?? null);
        setLastTxIndex(last?.transaction_index ?? null);
        setLastIndex(last?.index ?? null);

        setItemsCount(0);
        setStatus(SuccessStatus);
      } else {
        setStatus(ErrorStatus);
      }
    } catch (e) {
      setInternalTxsData([]);
      setMeta(null);
      setStatus(ErrorStatus);
    }
  }, [updateTx, fetchInternalTxsData]);

  const intFetchNextPage = useCallback(async () => {
    if (!updateTx) return;

    try {
      const nextItemsCount = intItemsCount === 0 ? 50 : intItemsCount + 50;

      if (!lastBlockNumber || lastTxIndex === null || lastIndex === null) {
        // If we don't have references yet, reload first page
        await intFetchFirstPage();
        return;
      }

      setStatus(FetchingStatus);

      const params = `/transactions/${updateTx}/internal-transactions?block_number=${encodeURIComponent(
        lastBlockNumber
      )}&transaction_index=${encodeURIComponent(
        lastTxIndex
      )}&index=${encodeURIComponent(
        lastIndex
      )}&items_count=${encodeURIComponent(nextItemsCount)}`;

      const response = await fetchInternalTxsData(params);

      if (response) {
        const items = response?.items ?? [];
        setInternalTxsData(items);
        setMeta(response?.data ?? null);

        const last = items[items.length - 1];
        setLastBlockNumber(last?.block_number ?? lastBlockNumber);
        setLastTxIndex(last?.transaction_index ?? lastTxIndex);
        setLastIndex(last?.index ?? lastIndex);

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
    intItemsCount,
    lastBlockNumber,
    lastTxIndex,
    lastIndex,
    intFetchFirstPage,
    fetchInternalTxsData,
  ]);

  // Auto load first page on mount or when network/updateTx changes
  useEffect(() => {
    if (isEvm && autoLoad && updateTx) intFetchFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoLoad, updateTx]);

  return {
    internalTxns,
    intMeta,
    intStatus,
    intIsLoading: status === FetchingStatus,
    intCurrentPage,
    intItemsCount,
    intFetchFirstPage,
    intFetchNextPage,
  };
}
