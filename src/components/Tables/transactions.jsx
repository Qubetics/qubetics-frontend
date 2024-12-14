import {
  InitStatus,
  tableLimit,
  ErrorStatus,
  SuccessStatus,
  FetchingStatus,
} from "@/constant/constant";
import { Table } from "antd";
import Loader from "@/components/loader/Loader";
import Pagination from "../Pagination/Pagination";
import React, { useState, useEffect } from "react";
import getTransactions from "@/services/getTransactions";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import { transactionSummarycolumn } from "@/constant/graphTableValues";
import { Datnotfound } from "../../../public/SvgIcons";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Transactions({ setTxnData }) {
  const { isNetworkChanged } = useGetNetwork();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [pageToSend, setPageToSend] = useState(1);
  const [nextCursor, setNextCursor] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousCursor, setPreviousCursor] = useState(1);
  const [transactionData, setTransactionData] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState(InitStatus);
  const page = searchParams.get("page") || 1;
  const pageid = searchParams.get("id") || 1;

  let chainType =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  const fetchData = async () => {
    try {
      setTransactionStatus(FetchingStatus);
      let response = await getTransactions(pageid, tableLimit);
      if (response?.error === false) {
        setTransactionData(response?.data?.transactions);
        setTxnData(response?.data);
        setPreviousCursor(response?.data?.prevCursor);
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

  const handleNext = () => {
    if (page < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageToSend(nextCursor);

      // Create a new URLSearchParams object to modify query parameters
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", currentPage + 1);
      newSearchParams.set("id", nextCursor);
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
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleLast = () => {
    if (page < totalPages) {
      setCurrentPage(totalPages);
      setPageToSend(11);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", totalPages);
      newSearchParams.set("id", 11);
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
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  return (
    <>
      {transactionStatus === InitStatus ||
      transactionStatus === FetchingStatus ? (
        <Loader />
      ) : (
        <>
          <Table
            columns={transactionSummarycolumn}
            dataSource={transactionData}
            className="commontable"
            pagination={false}
            locale={{
              emptyText: (
                <div>
                  <Datnotfound />
                  <p>No data </p>
                </div>
              ),
            }}
          />
          {totalPages && (
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
      )}
    </>
  );
}
