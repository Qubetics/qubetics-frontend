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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import { set } from "date-fns";
import { formatMillionNumber } from "@/utils/commonFunctions";
import { Select, Space } from "antd";

export default function Transactions({ setTxnData }) {
  const { isNetworkChanged } = useGetNetwork();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [pageToSend, setPageToSend] = useState(1);
  const [txCount, setTxCount] = useState();
  const [nextCursor, setNextCursor] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [previousCursor, setPreviousCursor] = useState(1);
  const [transactionData, setTransactionData] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState(InitStatus);
  const page = searchParams.get("page") || 1;
  const pageid = searchParams.get("id") || 1;
  const order = searchParams.get("order") || "desc";
  const [filterVal, setFilterVal] = useState("desc");

  let chainType =
    typeof window !== "undefined" && localStorage.getItem("chainType");

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
    if (isNetworkChanged) {
      fetchData();
      setPageToSend(1);
      setCurrentPage(1);
    }
  }, [isNetworkChanged]);

  useEffect(() => {
    fetchData();
  }, [pageid]);

  const handleChange = (value) => {
    setFilterVal(value);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", 1);
    newSearchParams.set("id", 1);
    newSearchParams.set("order", value);
    router.push(`?${newSearchParams.toString()}`);
    if (pageid == 1) {
      fetchData();
    }
  };
  const handleNext = () => {
    if (page < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageToSend(nextCursor);

      // Create a new URLSearchParams object to modify query parameters
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", currentPage + 1);
      newSearchParams.set("id", nextCursor);
      newSearchParams.set("order", filterVal);
      router.push(`?${newSearchParams.toString()}`);
    }
  };
  const handlePrevious = () => {
    if (page > 1) {
      setCurrentPage(page - 1);
      setPageToSend(previousCursor);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", page - 1);
      newSearchParams.set("id", previousCursor);
      newSearchParams.set("order", filterVal);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleLast = () => {
    if (page < totalPages) {
      setCurrentPage(totalPages);
      setPageToSend(lastPage);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", totalPages);
      newSearchParams.set("id", lastPage);
      newSearchParams.set("order", filterVal);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleFirst = () => {
    if (page <= totalPages) {
      setCurrentPage(1);
      setPageToSend(1);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", 1);
      newSearchParams.set("id", 1);
      newSearchParams.set("order", filterVal);

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
                defaultValue="desc"
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
      {/* {transactionStatus === InitStatus ||
      transactionStatus === FetchingStatus ? (
        <Loader />
      ) : ( */}
      <>
        <SkeletonTableWrapper
          columns={transactionSummarycolumn}
          isSkeleton={
            transactionStatus === FetchingStatus ||
            transactionStatus === InitStatus
          }
          dataSource={transactionData}
          className="commontable"
          pagination={false}
          // locale={{
          //   emptyText: (
          //     <div>
          //       <Datnotfound />
          //       <p>No data </p>
          //     </div>
          //   ),
          // }}
        />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            disablePrev={page === 1}
            disableNext={page === totalPages}
            handleFirst={handleFirst}
            handleLast={handleLast}
          />
        )}
      </>
      {/* )} */}
    </>
  );
}
