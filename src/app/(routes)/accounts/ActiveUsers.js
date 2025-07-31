import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { accountsColumns, dVPNColumn } from "@/constant/graphTableValues";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
// import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import getAccounts from "@/services/getAccounts";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import getAccountSummary from "@/services/getAccountSummary";

const ActiveUsers = ({ setTokensTxData, tokensTxData, order }) => {
  const [totalPages, setTotalPages] = useState(0);
  const [tokenStatus, setTokenStatus] = useState(InitStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams();
console.log(tokensTxData, "tokensTxData");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchData = async () => {
    try {
      setTokenStatus(FetchingStatus);
      
      const response = await getAccountSummary();
      console.log(response, "response");
      
      if (response && response.data) {
        setTokensTxData(response.data.result || []);
        const count = Number(response?.data?.result ?? 0) / tableLimit;
        setTotalPages(Math.ceil(count ?? 0));
        setTokenStatus(SuccessStatus);
      } else {
        setTokenStatus(ErrorStatus);
        setTokensTxData([]);
      }
    } catch (err) {
      console.error('Error fetching accounts data:', err);
      setTokenStatus(ErrorStatus);
      setTokensTxData([]);
    }
  };

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

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  };

  const handleFirst = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(1);
    }
  };

 

  useEffect(() => {
    fetchData();
  }, [currentPage, tableLimit, order]);

  return (
    <>
      <SkeletonTableWrapper
        columns={accountsColumns}
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

export default ActiveUsers;