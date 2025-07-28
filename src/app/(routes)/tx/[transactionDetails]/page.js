"use client";
import { useSearchData } from "@/components/contexts/searchingData";
import FilterResult from "@/components/FilterResult/FilterResult";
import Heading from "@/components/heading/Heading";
import Loader from "@/components/loader/Loader";
import LogsDetail from "@/components/logsDetail/LogsDetail";
import TransactionAction from "@/components/transferInfo/TransectionAction";
import TransferInfo from "@/components/transferInfo/TransferInfo";
import MessageAction from "@/components/messgaeInfo/MessageAction";
import MessageInfo from "@/components/messgaeInfo/MessageInfo";
import {
  DVPN_TRANSACTION_TYPE,
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";
import getSearchingValue from "@/services/search";
import { Tabs } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../../blocks/blocksummary.scss";
import Page from "../../notfound/page";
import getMessages from "@/services/getMessages";
import EventLogs from "@/components/eventLogs/eventLogs";

const page = () => {
  const searchParam = useSearchParams();
  const router = useRouter();
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [contractLogs, setContractLogs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [tab, setTab] = useState(searchParam.get("tab") || "0");
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [txDetailStatus, setTxDetailStatus] = useState(InitStatus); //init,fetching,success,error
  const params = useParams();
  const { searchData } = useSearchData();
  const values = Object.values(DVPN_TRANSACTION_TYPE);
  const [data, setData] = useState();

  let updateTx = "";

  const fetchData = async () => {
    try {
      if (searchData?.length == 0 || params?.transactionDetails) {
        setTxDetailStatus(FetchingStatus);
        if (
          params?.transactionDetails &&
          !params?.transactionDetails.startsWith("0x")
        ) {
          updateTx = `0x${params?.transactionDetails}`;
        } else {
          updateTx = params?.transactionDetails;
        }
        let response = await getSearchingValue(updateTx);
        if (response?.error == false) {
          setTransactionDetails(response?.data?.transaction);
          setTopics(response?.data?.contractLogs[0]?.topics);
          setContractLogs(JSON.parse(response?.data?.transaction?.logs));
          setTxDetailStatus(SuccessStatus);
        } else {
          setTxDetailStatus(ErrorStatus);
          return;
        }
      } else {
        setTransactionDetails(searchData);
        setTxDetailStatus(SuccessStatus);
      }
    } catch (err) {
      console.log("Error ", err);
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
          <TransferInfo data={transactionDetails} tab={tab} />

          {transactionDetails?.tokenInfo?.type === "ERC-20" &&
            transactionDetails?.logs &&
            transactionDetails?.input && (
              <TransactionAction data={transactionDetails} />
            )}
        </>
      ),
    },
    values.includes(transactionDetails?.type)
      ? {
          label: "Messages",
          key: "1",
          children: (
            <>
              <MessageAction data={data} />
            </>
          ),
        }
      : [],
    contractLogs?.length > 0
      ? {
          label: "Logs",
          key: "2",
          children: contractLogs?.map((e, i) => (
            <LogsDetail
              key={i + "logDetails"}
              contractLogs={e}
              index={i}
              topics={topics}
            />
          )),
        }
      : [],

    data?.[0]?.logs
      ? {
          label: "Event Logs",
          key: "3",
          children: (
            <>
              <EventLogs logs={JSON.parse(data?.[0]?.logs)} />
            </>
          ),
        }
      : [],
  ];

  const handleTabSelect = (e) => {
    setTab(e);
    const newSearchParams = new URLSearchParams(searchParam);
    newSearchParams.set("tab", e);
    router.replace(`?${newSearchParams.toString()}`, {
      shallow: true,
      scroll: false,
    });
  };

  useEffect(() => {
    if (params?.transactionDetails) {
      const fetchMessages = async () => {
        const response = await getMessages(params?.transactionDetails);
        setData(response?.data?.sessionEntries);
      };

      fetchData();
      fetchMessages();
    }
  }, [params?.transactionDetails]);

  return (
    <div className="blocksummary transferInfo">
      {txDetailStatus == InitStatus || txDetailStatus == FetchingStatus ? (
        <Loader />
      ) : txDetailStatus == SuccessStatus || txDetailStatus == ErrorStatus ? (
        <div className="container">
          {/* <SearchbarComponent searchStatus={searchStatus} setSerachStatus={setSerachStatus} />
           */}
          <FilterResult />
          {/* <Heading heading="Transaction Details" /> */}
          <div className="transecSec">
            <Tabs
              activeKey={tab}
              defaultActiveKey="0"
              className="contracttabs"
              items={tabItems}
              onChange={(e) => handleTabSelect(e)}
            />
          </div>
        </div>
      ) : (
        <Page />
      )}
    </div>
  );
};

export default page;
