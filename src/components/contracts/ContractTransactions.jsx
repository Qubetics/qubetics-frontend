"use-client";
import Page from "@/app/(routes)/notfound/page";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { contractTransactionsColumn } from "@/constant/graphTableValues";
import getContractTransactions from "@/services/getContractTransactions";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import Loader from "../loader/Loader";
import Pagination from "../Pagination/Pagination";

const ContractTransactions = ({ hash, tab }) => {
  const [transactions, setTransactions] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState(InitStatus);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchTransactions = async () => {
    try {
      let response = await getContractTransactions(
        currentPage,
        tableLimit,
        hash,
        tab
      );
      setTransactions(response?.data?.contracts);
      setTransactionStatus(SuccessStatus);
      const count = Number(response?.data?.count ?? 0) / tableLimit;
      setTotalPages(Math.ceil(count ?? 0));
    } catch (err) {
      setTransactionStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    setTransactionStatus(FetchingStatus);
    fetchTransactions();
  }, [currentPage, hash]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirst = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(1);
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  };

  return transactionStatus === InitStatus ||
    transactionStatus === FetchingStatus ? (
    <Loader />
  ) : transactionStatus === SuccessStatus ? (
    <div>
      {" "}
      <Table
        columns={contractTransactionsColumn}
        dataSource={transactions}
        pagination={false}
        className="commontable contractTable"
      />
      {totalPages > 10 && (
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
    </div>
  ) : (
    <Page />
  );
};

export default ContractTransactions;
