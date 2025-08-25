"use client";
import Page from "@/app/(routes)/notfound/page";
import { useLatestData } from "@/components/contexts/latest_data";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Loader from "@/components/loader/Loader";
import RecentTransaction from "@/components/recentTransaction/RecentTransaction";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  Routes,
  SuccessStatus,
  dashboardCount,
  pageNo,
} from "@/constant/constant";
import getTransactions from "@/services/getTransactions";
import { useRouter } from "next/navigation";
import { act, useEffect, useRef, useState } from "react";
import "./style.scss";
import { trackEvent } from "@/utils/eventTrack";
import Link from "next/link";
import { isEvmChain } from "@/components/header/helper";

const RecentTransactions = () => {
  const [recentTxns, setRecentTxns] = useState([]);
  const [recentTxnStatus, setRecentTxnStatus] = useState(InitStatus);
  const newTransactionIndexRef = useRef(0);
  const webSocketData = useLatestData();
  const isEvm = isEvmChain();
  const [newTransactionIndex, setNewTransactionIndex] = useState(0);
  const maxNonStaticElements = 6;
  const router = useRouter();
  // const { isNetworkChanged } = useGetNetwork();

  const fetchData = async () => {
    try {
      setRecentTxnStatus(FetchingStatus);
      // let res = await getTransactions(pageNo, dashboardCount, "desc");
      let res = await getTransactions(
        pageNo,
        dashboardCount,
        "/main-page/transactions"
      );
      if (res) {
        const accendingBlock = isEvm ? res : res?.data?.transactions;
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
    getSocketTxn();
  }, [webSocketData?.transactions]);

  const getSocketTxn = () => {
    const txns = webSocketData?.transactions;
    if (!txns) return;

    if (isEvm) {
      newTransactionIndexRef.current += txns?.transaction || 0;
      setNewTransactionIndex(newTransactionIndexRef.current);
    } else {
      const newArray = Array.isArray(txns) ? txns : [txns];
      if (
        newArray.length > 0 &&
        !recentTxns?.some(
          (item) => item?.blocknumber === newArray[0]?.blocknumber
        )
      ) {
        newTransactionIndexRef.current += newArray.length;
        setNewTransactionIndex(newTransactionIndexRef.current);

        setRecentTxns((prev) => {
          let updated = [...prev];
          if (updated.length >= maxNonStaticElements) {
            updated.pop();
          }
          updated.unshift(newArray[0]);
          return updated;
        });
      }
    }
  };
  const handleClick = () => {
    trackEvent({ action: "click", category: "Dashboard", label: "View All" });
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
            <p> View all</p>
          </div>
        </div>

        {/* Alert box */}
        {
          <div
            style={{
              backgroundColor: "#5B2B1B",
              borderRadius: "5px",
              padding: "8px",
              paddingLeft: "20px",
              color: "white",
              textDecoration: "none",
            }}
          >
            {newTransactionIndex > 0 ? (
              <>
                <Link
                  style={{
                    color: "#4299E1",
                    textDecoration: "none",
                  }}
                  href={`/tx`}
                >
                  {newTransactionIndex} more{" "}
                  {newTransactionIndex < 2 ? "transaction" : "transactions"}
                </Link>{" "}
                have come in
              </>
            ) : (
              <p style={{ color: "white" }}>Scanning new transactions...</p>
            )}
          </div>
        }

        {recentTxns?.length > 0 ? (
          recentTxns?.slice(0, 4)?.map((res, index) => {
            return (
              <RecentTransaction
                key={res?.hash || res?.txhash}
                customClass="carousel-item"
                data={res}
                isEvm={isEvm}
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
