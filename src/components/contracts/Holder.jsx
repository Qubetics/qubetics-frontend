"use-client";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { HolderColumn } from "@/constant/graphTableValues";
import getTokenHolders from "@/services/getTokenHolders";
import { noExponential } from "@/utils/commonFunctions";
import { useEffect, useState } from "react";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import Image from "next/image";
import notFound from "../../assets/svg/notFount.svg";
const Holder = ({ hash }) => {
  const [tokenHolders, setTokenHolders] = useState([]);
  const [tokenDetails, setTokenDetails] = useState({});
  const [holdersCount, setHoldersCount] = useState(0);
  const [holderStatus, setHoldersStatus] = useState(InitStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const [newArr, setNewArr] = useState([]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const fetchTransactions = async () => {
    try {
      let response = await getTokenHolders(currentPage, tableLimit, hash);
      setTokenHolders(response?.data?.holders);
      setTokenDetails(response?.data?.tokenDetails);
      setHoldersCount(response?.data?.count);
      setHoldersStatus(SuccessStatus);
    } catch (err) {
      setHoldersStatus(ErrorStatus);
      return err;
    }
  };
  useEffect(() => {
    if (tokenHolders?.length > 0) {
      let newDataSet = tokenHolders?.map((item, index) => {
        return {
          rank: index + 1,
          address: item?.address,
          tokenBalance: noExponential(
            Number(item?.tokenBalance) /
              10 ** (Number(tokenDetails?.decimal) || 18)
          ),
          totalSupply: noExponential(
            Number(tokenDetails?.totalSupply) /
              10 ** (Number(tokenDetails?.decimal) || 18)
          ),
        };
      });
      setNewArr(newDataSet);
    }
  }, [tokenHolders]);

  useEffect(() => {
    setHoldersStatus(FetchingStatus);
    fetchTransactions();
  }, [currentPage, hash]);

  return (
    // holderStatus === InitStatus || holderStatus === FetchingStatus ? (
    //   <Loader />
    // ) : holderStatus === SuccessStatus ? (
    <div>
      {" "}
      <SkeletonTableWrapper
        isSkeleton={
          holderStatus === InitStatus || holderStatus === FetchingStatus
        }
        columns={HolderColumn}
        dataSource={newArr}
        locale={{
          emptyText: (
            <div>
              <Image src={notFound} width={150} height={90} />
              <p>No data </p>
            </div>
          ),
        }}
        pagination={
          holdersCount > tableLimit && {
            current: currentPage,
            pageSize: tableLimit,
            total: holdersCount,
            onChange: handlePageChange,
          }
        }
        className="commontable contractTable holderTable"
      />
    </div>
    // ) : (
    //   <Page />
  );
};

export default Holder;
