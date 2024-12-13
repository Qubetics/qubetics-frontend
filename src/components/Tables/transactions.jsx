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

export default function Transactions({ setTxnData }) {
  const { isNetworkChanged } = useGetNetwork();
  const [pageToSend, setPageToSend] = useState(1);
  const [nextCursor, setNextCursor] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousCursor, setPreviousCursor] = useState(1);
  const [transactionData, setTransactionData] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState(InitStatus);
  let chainType =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  const fetchData = async () => {
    try {
      setTransactionStatus(FetchingStatus);
      let response = await getTransactions(pageToSend, tableLimit);
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
  }, [pageToSend]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageToSend(nextCursor);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageToSend(previousCursor);
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
      setPageToSend(chainType == "Native Chain" ? 22775 : 11);
    }
  };

  const handleFirst = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(1);
      setPageToSend(1);
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
              currentPage={currentPage}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              disablePrev={currentPage === 1}
              disableNext={currentPage === totalPages}
              handleFirst={handleFirst}
              handleLast={handleLast}
            />
          )}
        </>
      )}
    </>
  );
}
