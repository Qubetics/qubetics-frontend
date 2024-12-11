"use client";
import {
  InitStatus,
  tableLimit,
  ErrorStatus,
  SuccessStatus,
  FetchingStatus,
} from "@/constant/constant";
import { Table } from "antd";
import Loader from "../loader/Loader";
import Page from "@/app/(routes)/notfound/page";
import React, { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import "../transferInfo/TransferInformation.scss";
import { useGetNetwork } from "../contexts/networkChanged";
import getTransactionByBlocks from "@/services/getTransactionByBlocks";
import { TransactionDetailsColumns } from "@/constant/graphTableValues";

const TransactionTable = ({ params }) => {
  const [transactionByBlock, setTransactionByBlock] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionByBlockStatus, setTransactionByBlockStatus] =
    useState(InitStatus);
  const { isNetworkChanged } = useGetNetwork();

  const fetchByBlock = async () => {
    try {
      setTransactionByBlockStatus(FetchingStatus);
      let response = await getTransactionByBlocks(
        params,
        currentPage,
        tableLimit
      );
      if (response?.error === false) {
        setTransactionByBlock(response?.data?.transaction);
        const count = Number(response?.data?.count ?? 0) / tableLimit;
        setTotalPages(Math.ceil(count ?? 0));
        setTransactionByBlockStatus(SuccessStatus);
      } else {
        setTransactionByBlockStatus(ErrorStatus);
      }
    } catch (err) {
      setTransactionByBlockStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    fetchByBlock();
  }, [currentPage, params]);

  useEffect(() => {
    if (isNetworkChanged) {
      fetchByBlock();
    }
  }, [isNetworkChanged]);

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
  return (
    <div>
      {transactionByBlockStatus === InitStatus ||
      transactionByBlockStatus === FetchingStatus ? (
        <Loader />
      ) : transactionByBlockStatus === SuccessStatus ? (
        <>
          <Table
            columns={TransactionDetailsColumns}
            dataSource={transactionByBlock}
            className="commontable"
            pagination={false}
          />
          {totalPages && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              disablePrev={currentPage === 1}
              disableNext={currentPage === totalPages}
            />
          )}
        </>
      ) : (
        <Page />
      )}
    </div>
  );
};

export default TransactionTable;
