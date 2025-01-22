"use client";
import FilterResult from "@/components/FilterResult/FilterResult";
import TransactionsTable from "@/components/Tables/transactions";
import { useLatestData } from "@/components/contexts/latest_data";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Heading from "@/components/heading/Heading";
import { InitStatus } from "@/constant/constant";
import getContractsGraph from "@/services/getContractsGraph";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  ActiveAccountToday,
  ContractTransactions,
  TotalTransactions,
} from "../../../../public/SvgIcons";
import "../blocks/blocksummary.scss";
import { TxInfo } from "./txInfo";

const Transactionsummary = () => {
  // const webSocketData = useLatestData();

  const { isNetworkChanged } = useGetNetwork();
  const [contractCount, setContractCount] = useState(0);
  const [txnData, setTxnData] = useState({});
  const [searchStatus, setSerachStatus] = useState(InitStatus);

  // useEffect(() => {
  //   if (isNetworkChanged == false) {
  //     fetchContractData();
  //   }
  // }, [isNetworkChanged]);

  // const fetchContractData = () => {
  //   getContractsGraph()
  //     .then((res) => {
  //       setContractCount(res?.data);
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // };

  return (
    <div className="blocksummary">
      <div className="container">
        {/* <SearchbarComponent
          searchStatus={searchStatus}
          setSerachStatus={setSerachStatus}
        /> */}
        <FilterResult />
        <Heading heading="Transaction Summary" />
        <TxInfo txnData={txnData} />

        {/* Transactions Table */}
        <TransactionsTable setTxnData={setTxnData} />
      </div>
    </div>
  );
};

export default Transactionsummary;
