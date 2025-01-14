"use client";
import { useSearchData } from "@/components/contexts/searchingData";
import Heading from "@/components/heading/Heading";
import Loader from "@/components/loader/Loader";
import LogsDetail from "@/components/logsDetail/LogsDetail";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import TransactionAction from "@/components/transferInfo/TransectionAction";
import TransferInfo from "@/components/transferInfo/TransferInfo";
import { ErrorStatus, FetchingStatus, InitStatus, SuccessStatus } from "@/constant/constant";
import getSearchingValue from "@/services/search";
import { Tabs } from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "../../blocks/blocksummary.scss";
import Page from "../../notfound/page";

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

  let updateTx = "";

  useEffect(() => {
    fetchData();
  }, [params?.transactionDetails]);

  const fetchData = async () => {
    try {
      if (searchData?.length == 0 || params?.transactionDetails) {
        setTxDetailStatus(FetchingStatus);
        if (params?.transactionDetails && !params?.transactionDetails.startsWith("0x")) {
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

          {transactionDetails?.tokenInfo?.type === "ERC-20" && transactionDetails?.logs && transactionDetails?.input && <TransactionAction data={transactionDetails} />}
        </>
      ),
    },
    contractLogs?.length > 0 && {
      label: "Logs",
      key: "1",
      children: contractLogs.map((e, i) => <LogsDetail key={i + "logDetails"} contractLogs={e} index={i} topics={topics} />),
    },
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

  return (
    <div className="blocksummary transferInfo">
      {txDetailStatus == InitStatus || txDetailStatus == FetchingStatus ? (
        <Loader />
      ) : txDetailStatus == SuccessStatus || txDetailStatus == ErrorStatus ? (
        <div className="container">
          <SearchbarComponent searchStatus={searchStatus} setSerachStatus={setSerachStatus} />
          {/* <Heading heading="Transaction Details" /> */}
          <div className="transecSec">
            {contractLogs?.length > 0 ? (
              <Tabs activeKey={tab} defaultActiveKey="0" className="contracttabs" items={tabItems} onChange={(e) => handleTabSelect(e)} />
            ) : (
              <>
                <Heading heading="Overview" />
                <TransferInfo data={transactionDetails} tab={tab} />

                {transactionDetails?.tokenInfo?.type === "ERC-20" && transactionDetails?.logs && transactionDetails?.input && <TransactionAction data={transactionDetails} />}
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
