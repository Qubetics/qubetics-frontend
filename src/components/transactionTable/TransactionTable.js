"use client";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { TransactionDetailsColumns } from "@/constant/graphTableValues";
import getTransactionByBlocks from "@/services/getTransactionByBlocks";
import { useEffect, useState } from "react";
import { useGetNetwork } from "../contexts/networkChanged";
import Pagination from "../Pagination/Pagination";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import "../transferInfo/TransferInformation.scss";

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
      <>
        <SkeletonTableWrapper
          columns={TransactionDetailsColumns}
          dataSource={transactionByBlock}
          className="commontable"
          pagination={false}
          isSkeleton={
            transactionByBlockStatus === FetchingStatus ||
            transactionByBlockStatus === InitStatus
          }
        />
        {totalPages > 1 && (
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
    </div>
  );
};

export default TransactionTable;
