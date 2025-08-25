/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useSearchData } from "@/components/contexts/searchingData";
import FilterResult from "@/components/FilterResult/FilterResult";
import Heading from "@/components/heading/Heading";
import Loader from "@/components/loader/Loader";
import LogsDetail from "@/components/logsDetail/LogsDetail";
import TransactionAction from "@/components/transferInfo/TransectionAction";
import TransferInfo from "@/components/transferInfo/TransferInfo";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";
import { Pagination, Tabs } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../../blocks/blocksummary.scss";
import Page from "../../notfound/page";
import InternalTxns from "@/components/contracts/InternalTxns";
import getNewSearchingValue from "@/services/newSearch";
import useEvmTransactionLogsNextOnly from "@/hooks/useLogsPagination";
import useEvmTransactionInternalTxsNextOnly from "@/hooks/useInternalTxn";
import { isEvmChain } from "@/components/header/helper";

const page = () => {
  const searchParam = useSearchParams();
  const router = useRouter();
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [tab, setTab] = useState(searchParam.get("tab") || "0");
  const [txDetailStatus, setTxDetailStatus] = useState(InitStatus); //init,fetching,success,error
  const params = useParams();
  const { searchData } = useSearchData();
  const isEvm = isEvmChain();

  let updateTx = params?.transactionDetails;
  if (updateTx && !updateTx.startsWith("0x")) {
    updateTx = `0x${updateTx}`;
  }

  const {
    logsData,
    meta,
    topics,
    status,
    isLoading,
    currentPage,
    itemsCount,
    fetchFirstPage,
    fetchNextPage,
  } = useEvmTransactionLogsNextOnly({
    updateTx,
    autoLoad: true,
    isEvm,
  });

  const { internalTxns, intStatus } = useEvmTransactionInternalTxsNextOnly({
    updateTx,
    autoLoad: true,
    isEvm,
  });

  useEffect(() => {
    fetchData();
  }, [params?.transactionDetails]);

  const fetchData = async () => {
    try {
      const isDirectSearch =
        searchData?.length === 0 || params?.transactionDetails;

      // If no search data or transaction details present
      if (isDirectSearch) {
        setTxDetailStatus(FetchingStatus);
        let response = await getNewSearchingValue(updateTx);
        if (response) {
          setTransactionDetails(isEvm ? response : response?.data?.transaction);
          setTxDetailStatus(SuccessStatus);
        } else {
          setTxDetailStatus(ErrorStatus);
        }
      } else {
        // Directly use existing searchData
        setTransactionDetails(searchData);
        setTxDetailStatus(SuccessStatus);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setTxDetailStatus(ErrorStatus);
      return err;
    }
  };

  const tabItems = [
    {
      label: "Overview",
      key: "0",
      children: (
        <>
          <TransferInfo
            data={transactionDetails}
            tab={tab}
            internalTxns={internalTxns}
            internalTxnCount={internalTxns?.length}
            setTab={setTab}
          />

          {transactionDetails?.tokenInfo?.type === "ERC-20" &&
            transactionDetails?.logs &&
            transactionDetails?.input && (
              <TransactionAction data={transactionDetails} />
            )}
        </>
      ),
    },
    logsData && {
      label: "Logs",
      key: "1",
      children: (
        <>
          {logsData.map((e, i) => (
            <LogsDetail
              key={i + "logDetails"}
              contractLogs={e}
              index={i}
              topics={topics}
              fetchFirstPage={fetchFirstPage}
              fetchNextPage={fetchNextPage}
              itemsCount={itemsCount}
              currentPage={currentPage}
            />
          ))}

          {logsData.length < 50 ? (
            ""
          ) : (
            <Pagination
              // totalPages={totalPages}
              currentPage={currentPage}
              handleNext={fetchNextPage}
              disableNext={!itemsCount}
              disablePrev={currentPage == 1}
              handleFirst={fetchFirstPage}
              isEvm={isEvm}
              // handleLast={handleLast}
            />
          )}
        </>
      ),
    },
    {
      label: "Internal Transactions",
      key: "2",
      children: (
        <>
          <InternalTxns
            internalTxns={internalTxns}
            intStatus={intStatus}
            hash={params?.transactionDetails}
            tab={tab}
            isEvm={isEvm}
          />
        </>
      ),
    },
  ].filter(Boolean);

  const handleTabSelect = (e) => {
    setTab(e);
    const newSearchParams = new URLSearchParams(searchParam);
    newSearchParams.set("tab", e);
    router.replace(`?${newSearchParams.toString()}`, {
      shallow: true,
      scroll: false,
    });
  };

  return (
    <div className="blocksummary transferInfo">
      {txDetailStatus == FetchingStatus ? (
        <Loader />
      ) : txDetailStatus == SuccessStatus ? (
        <div className="container">
          {/* <SearchbarComponent searchStatus={searchStatus} setSerachStatus={setSerachStatus} />
           */}
          <FilterResult />
          {/* <Heading heading="Transaction Details" /> */}
          <div className="transecSec">
            {logsData?.length > 0 ? (
              <Tabs
                activeKey={tab}
                defaultActiveKey="0"
                className="contracttabs"
                items={tabItems}
                onChange={(e) => handleTabSelect(e)}
              />
            ) : (
              <>
                <Heading heading="Overview" />
                <TransferInfo
                  data={transactionDetails}
                  tab={tab}
                  isEvm={isEvm}
                />

                {transactionDetails?.tokenInfo?.type === "ERC-20" &&
                  transactionDetails?.logs &&
                  transactionDetails?.input && (
                    <TransactionAction data={transactionDetails} />
                  )}
              </>
            )}
          </div>
        </div>
      ) : (
        <Page />
      )}
    </div>
  );
};

export default page;
