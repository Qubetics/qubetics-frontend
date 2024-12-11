"use client";
import React, { useState, useEffect } from "react";
import Heading from "@/components/heading/Heading";
import RecentTransaction from "@/components/recentTransaction/RecentTransaction";
import getTransactions from "@/services/getTransactions";
import { useLatestData } from "@/components/contexts/latest_data";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  Routes,
  SuccessStatus,
  dashboardCount,
  pageNo,
} from "@/constant/constant";
import { useRouter } from "next/navigation";
import "./style.scss";
import Page from "@/app/(routes)/notfound/page";
import Loader from "@/components/loader/Loader";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import { RightOutlined } from "@ant-design/icons";

const RecentTransactions = () => {
  const [recentTxns, setRecentTxns] = useState([]);
  const [recentTxnStatus, setRecentTxnStatus] = useState(InitStatus);
  const webSocketData = useLatestData();
  const [currentIndex, setCurrentIndex] = useState(4);
  const maxNonStaticElements = 6;
  const router = useRouter();
  const { isNetworkChanged } = useGetNetwork();

  const fetchData = async () => {
    try {
      setRecentTxnStatus(FetchingStatus);
      let res = await getTransactions(pageNo, dashboardCount);

      if (res?.error === false) {
        const accendingBlock = res?.data?.transactions;
        setRecentTxns(accendingBlock);
        setRecentTxnStatus(SuccessStatus);
      } else {
        setRecentTxnStatus(ErrorStatus);
      }
    } catch (err) {
      setRecentTxnStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isNetworkChanged == true) {
      fetchData();
    }
  }, [isNetworkChanged]);

  useEffect(() => {
    getSocketTxn();
  }, [webSocketData?.transactions]);

  const getSocketTxn = () => {
    if (
      Array.isArray(webSocketData?.transactions) &&
      webSocketData?.transactions?.length > 0
    ) {
      const newArray = webSocketData?.transactions;
      if (
        !recentTxns?.some(
          (item) => item?.blocknumber === newArray[0]?.blocknumber
        )
      ) {
        let updatedSocketBlock = [...recentTxns];
        if (updatedSocketBlock?.length >= maxNonStaticElements) {
          updatedSocketBlock?.shift();
          setCurrentIndex(4);
        }
        updatedSocketBlock?.push(newArray[0]);
        setRecentTxns(updatedSocketBlock);
        setCurrentIndex(5);
      }
    } else if (!Array.isArray(webSocketData?.transactions)) {
      const newArray = webSocketData?.transactions;
      if (
        !recentTxns?.some((item) => item?.blocknumber === newArray?.blocknumber)
      ) {
        let updatedSocketBlock = [...recentTxns];
        if (updatedSocketBlock?.length >= maxNonStaticElements) {
          updatedSocketBlock?.shift();
          setCurrentIndex(4);
        }
        updatedSocketBlock?.push(newArray);
        setRecentTxns(updatedSocketBlock);
        setCurrentIndex(5);
      }
    }
  };

  const handleClick = () => {
    router.push(Routes?.TRANSACTIONS);
  };

  return recentTxnStatus === InitStatus ||
    recentTxnStatus === FetchingStatus ? (
    <Loader />
  ) : (
    <>
      <div className="commontableBG recentTrans">
        <div className="commontableBG_head">
          <h2>Latest Transactions</h2>
          <div className="viewAll" onClick={handleClick}>
            <p> View All</p>
          </div>
        </div>

        {recentTxns?.length > 0 ? (
          recentTxns.slice(0, 4)?.map((res, index) => {
            return (
              <RecentTransaction
                key={res?.txString}
                customClass="carousel-item"
                data={res}
              />
            );
          })
        ) : (
          <Page />
        )}
      </div>
    </>
  );
};

export default RecentTransactions;
