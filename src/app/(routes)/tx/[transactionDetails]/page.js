"use client";
import React, { useEffect, useState } from "react";
import "../../blocks/blocksummary.scss";
import Heading from "@/components/heading/Heading";
import TransactionDetails from "@/components/transactionDetails/TransactionDetails";
import TransferInfo from "@/components/transferInfo/TransferInfo";
import { useParams } from "next/navigation";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";
import Loader from "@/components/loader/Loader";
import Page from "../../notfound/page";
import getSearchingValue from "@/services/search";
import LogsDetail from "@/components/logsDetail/LogsDetail";
import { useSearchData } from "@/components/contexts/searchingData";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import TransactionAction from "@/components/transferInfo/TransectionAction";
import SearchbarComponent from "@/components/search/SearchbarComponent";

const page = () => {
  const [transactionDetails, setTransactionDetails] = useState([]);
  const [contractLogs, setContractLogs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [txDetailStatus, setTxDetailStatus] = useState(InitStatus); //init,fetching,success,error
  const params = useParams();
  const { searchData } = useSearchData();
  const { isNetworkChanged } = useGetNetwork();
  let updateTx = "";

  useEffect(() => {
    fetchData();
  }, [params?.transactionDetails]);

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

  // useEffect(() => {
  //   if (isNetworkChanged == true) {
  //     fetchData();
  //   }
  // }, [isNetworkChanged]);
  return (
    <div className="blocksummary transferInfo">
      {txDetailStatus == InitStatus || txDetailStatus == FetchingStatus ? (
        <Loader />
      ) : txDetailStatus == SuccessStatus || txDetailStatus == ErrorStatus ? (
        <div className="container">
           <SearchbarComponent
            searchStatus={searchStatus}
            setSerachStatus={setSerachStatus}
          />
          <Heading heading="Transaction Details" />
          <TransferInfo data={transactionDetails} />
          {/* transactionDetails?.tokenInfo?.type == 'ERC-20' && */}
          {transactionDetails?.tokenInfo?.type == "ERC-20" &&
            transactionDetails?.logs &&
            transactionDetails?.input && (
              <TransactionAction data={transactionDetails} />
            )}
          {/* <Heading heading="Transaction Detailss" />
          <TransactionDetails data={transactionDetails} /> */}
          {contractLogs?.length > 0 && (
            <>
              <Heading heading="Logs" />
              {/* <LogsDetail data={contractLogs[0]} /> */}
              {contractLogs.map((e, i) => (
                <LogsDetail
                  key={i + "logDetails"}
                  contractLogs={e}
                  index={i}
                  topics={topics}
                />
              ))}
            </>
          )}
        </div>
      ) : (
        <Page />
      )}
    </div>
  );
};

export default page;
