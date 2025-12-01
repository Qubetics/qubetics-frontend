import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { tokensByAddressColumn } from "@/constant/graphTableValues";
import getTokenByAddress from "@/services/getTokenByAddress";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetNetwork } from "../contexts/networkChanged";
import Pagination from "../Pagination/Pagination";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";

const TokenByAddress = ({ setTokensData }) => {
  const [tokenData, setTokenData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [tokenStatus, setTokenStatus] = useState(InitStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams();
  const { isNetworkChanged } = useGetNetwork();

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  // };

  const fetchData = async () => {
    try {
      setTokenStatus(FetchingStatus);
      let response = await getTokenByAddress(
        params?.addressDetail,
        currentPage
      );
      setTokenData(
        response?.data?.contractDetails || response?.data?.tokenDetails
      );
      setTokensData(
        response?.data?.contractDetails || response?.data?.tokenDetails
      );
      const count = Number(response?.data?.count ?? 0) / tableLimit;
      setTotalPages(Math.ceil(count ?? 0));

      setTokenStatus(SuccessStatus);
    } catch (err) {
      setTokenStatus(ErrorStatus);
      return err;
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

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (isNetworkChanged) {
      fetchData();
    }
  }, [isNetworkChanged]);

  return (
    <>
      <SkeletonTableWrapper
        columns={tokensByAddressColumn}
        dataSource={tokenData}
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
          disablePrev={currentPage === 1}
          disableNext={currentPage === totalPages}
        />
      )}
    </>
  );
};

export default TokenByAddress;
