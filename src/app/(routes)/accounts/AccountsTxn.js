import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { accountsColumns } from "@/constant/graphTableValues";
import { useEffect, useState } from "react";
import getAccounts from "@/services/getAccounts";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import Pagination from "@/components/Pagination/Pagination";

const AccountsTxn = ({ order, activeTab, onCountChange }) => {
  const [tokensTxData, setTokensTxData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [tokenStatus, setTokenStatus] = useState(InitStatus);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      setTokenStatus(FetchingStatus);
      const response = await getAccounts(currentPage, tableLimit, order);
      
      if (response && response?.data) {
        const result = response?.data?.result || [];
        const totalCount = Number(response?.data?.total_count ?? result.length);
        setTokensTxData(result);
        setTotalPages(Math.ceil(totalCount / tableLimit));
        setTokenStatus(SuccessStatus);
        
        onCountChange?.(totalCount);
      } else {
        setTokenStatus(ErrorStatus);
        setTokensTxData([]);
        onCountChange?.(0);
      }
    } catch (err) {
      console.error("Error fetching accounts data:", err);
      setTokenStatus(ErrorStatus);
      setTokensTxData([]);
      onCountChange?.(0);
    }
  };

  useEffect(() => {
    if (activeTab === "0") {
      fetchData();
    }
  }, [currentPage, order]);

  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleLast = () =>
    currentPage < totalPages && setCurrentPage(totalPages);
  const handleFirst = () => setCurrentPage(1);

  return (
    <>
      <SkeletonTableWrapper
        columns={accountsColumns(currentPage, tableLimit)}
        dataSource={tokensTxData}
        className="commontable"
        isSkeleton={
          tokenStatus === FetchingStatus || tokenStatus === InitStatus
        }
        pagination={false}
      />
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          handleLast={handleLast}
          handleFirst={handleFirst}
          disablePrev={currentPage === 1}
          disableNext={currentPage === totalPages}
        />
      )}
    </>
  );
};

export default AccountsTxn;
