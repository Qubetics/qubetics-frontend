import { useGetNetwork } from "@/components/contexts/networkChanged";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { transactionSummarycolumn } from "@/constant/graphTableValues";
import getTransactions from "@/services/getTransactions";
import { formatMillionNumber } from "@/utils/commonFunctions";
import { Select, Space } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import useEvmTransactionsNextOnly from "@/hooks/usePagination";
import { isEvmChain } from "../header/helper";

export default function Transactions({ setTxnData }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [pageToSend, setPageToSend] = useState(1);
  const [txCount, setTxCount] = useState();
  const [nextCursor, setNextCursor] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [lastPage, setLastPage] = useState();
  const [previousCursor, setPreviousCursor] = useState(1);
  const [transactionData, setTransactionData] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState(InitStatus);
  const { isNetworkChanged } = useGetNetwork();
  const isEvm = isEvmChain();
  const page = searchParams.get("page") || 1;
  const pageid = searchParams.get("id") || 1;
  const order = searchParams.get("order") || "desc";
  const [filterVal, setFilterVal] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const {
    meta,
    status,
    isLoading,
    currentPage: currentPagee,
    itemsCount,
    fetchFirstPage,
    fetchNextPage,
  } = useEvmTransactionsNextOnly({
    setTransactionData,
    autoLoad: true,
    networkChangedFlag: isNetworkChanged,
    isEvm,
  });
  const fetchData = async () => {
    try {
      setTransactionStatus(FetchingStatus);
      let response = await getTransactions(pageid, tableLimit, order);
      if (response?.error === false) {
        setTransactionData(response?.data?.transactions);
        setTxCount(response?.data?.count);
        setTxnData(response?.data);
        setPreviousCursor(response?.data?.prevCursor);
        setLastPage(response?.data?.lastPage);
        setNextCursor(response?.data?.nextCursor);
        setTransactionStatus(SuccessStatus);
        const txCount = Number(response?.data?.count ?? 0) / tableLimit;

        if (Number.isInteger(txCount)) {
          setTotalPages(txCount);
        } else {
          setTotalPages(Number(txCount.toString().split(".")[0] ?? 0) + 1);
        }
      } else {
        setTransactionStatus(ErrorStatus);
      }
    } catch (err) {
      setTransactionData([]);
      console.log("Error while getting tx ", err);
      setTransactionStatus(ErrorStatus);
      return err;
    }
  };
  useEffect(() => {
    // load first page on mount and when network changes
    if (isEvm) {
      fetchFirstPage();
    }
    if (!isEvm && isNetworkChanged) {
      fetchData();
      setPageToSend(1);
      setCurrentPage(1);
    }
  }, [isEvm, isNetworkChanged, fetchFirstPage]);

  // Handlers for buttons

  const handleBackToFirst = () => {
    if (!isEvm) return;
    fetchFirstPage();
  };
  // If you still need to expose meta to parent
  useEffect(() => {
    if (isEvm && setTxnData) setTxnData(meta);
  }, [meta, setTxnData]);

  useEffect(() => {
    !isEvm && fetchData();
  }, [pageid, order]);

  const handleChange = (value) => {
    setFilterVal(value);
    setCurrentPage(1);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", 1);
    newSearchParams.set("id", 1);
    newSearchParams.set("order", value);
    router.push(`?${newSearchParams.toString()}`);
  };
  const handleNext = () => {
    if (isEvm) {
      fetchNextPage();
      return;
    }
    if (page < totalPages) {
      // Create a new URLSearchParams object to modify query parameters
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", Number(page) + 1);
      newSearchParams.set("id", nextCursor);
      newSearchParams.set("order", order);
      router.push(`?${newSearchParams.toString()}`);
    }
  };
  const handlePrevious = () => {
    if (isEvm) return;
    if (page > 1) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", Number(page) - 1);
      newSearchParams.set("id", previousCursor);
      newSearchParams.set("order", order);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleLast = () => {
    if (page < totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", totalPages);
      newSearchParams.set("id", lastPage);
      newSearchParams.set("order", order);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleFirst = () => {
    if (isEvm) {
      handleBackToFirst();
      return;
    }
    if (page <= totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", 1);
      newSearchParams.set("id", 1);
      newSearchParams.set("order", order);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  return (
    <>
      <div className="totalTransactions">
        {txCount && (
          <>
            <h2>{`Total of ${formatMillionNumber(
              Number(txCount)
            )} transactions`}</h2>
            <Space wrap>
              <Select
                title=""
                defaultValue={order}
                style={{
                  width: 123,
                }}
                onChange={handleChange}
                className="innerSelect"
                options={[
                  {
                    value: "desc",
                    label: "Newest",
                  },
                  {
                    value: "asc",
                    label: "Oldest",
                  },
                ]}
              />
            </Space>
          </>
        )}
      </div>
      <>
        <SkeletonTableWrapper
          columns={transactionSummarycolumn}
          isSkeleton={
            (isEvm && isLoading) ||
            (!isEvm && transactionStatus === FetchingStatus)
          }
          dataSource={transactionData}
          className="commontable"
          pagination={false}
          rowKey={(row) =>
            row.hash || row.block_number - row.index || Math.random()
          }
        />
        {(isEvm || totalPages > 1) && (
          <Pagination
            totalPages={isEvm ? "" : totalPages}
            currentPage={isEvm ? currentPagee : page}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            disablePrev={isEvm ? currentPagee == 1 : page === 1}
            disableNext={page === totalPages}
            handleFirst={handleFirst}
            handleLast={handleLast}
            isEvm={isEvm}
          />
        )}
      </>
      {/* )} */}
    </>
  );
}
