"use-client";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { contractTransactionsColumn, internalTxns } from "@/constant/graphTableValues";
import getContractTransactions from "@/services/getContractTransactions";
import { useEffect, useState } from "react";
import notFound from "../../assets/svg/notFount.svg";
import Pagination from "../Pagination/Pagination";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import Image from "next/image";
import getInternalTxns from "@/services/getInternalTxn";

const InternalTxns = ({ hash, tab }) => {
  const [transactions, setTransactions] = useState([]);
  const [transactionStatus, setTransactionStatus] = useState(InitStatus);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchTransactions = async () => {
    try {
      let response = await getInternalTxns(currentPage, tableLimit, hash, tab);

      setTransactions(response?.data?.internalTxns);
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
//   const getTableColumn = () => {
//     if (tab == 1) {
//       return contractTransactionsColumn?.filter(
//         (item) => item?.key !== "method"
//       );
//     }
//     return contractTransactionsColumn?.filter((item) => item?.key !== "fee");
//   };
  return (
    // transactionStatus === InitStatus ||
    //   transactionStatus === FetchingStatus ? (
    //   <Loader />
    // ) : transactionStatus === SuccessStatus ? (
    <div>
      <SkeletonTableWrapper
        isSkeleton={
          transactionStatus === FetchingStatus ||
          transactionStatus === InitStatus
        }
        columns={internalTxns}
        dataSource={transactions}
        pagination={false}
        className="commontable contractTable"
        locale={{
          emptyText: (
            <div>
              <Image src={notFound} width={150} height={90} />
              <p>No data </p>
            </div>
          ),
        }}
      />
      {totalPages > 1 && (
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
    // ) : (
    //   <Page />
  );
};

export default InternalTxns;
