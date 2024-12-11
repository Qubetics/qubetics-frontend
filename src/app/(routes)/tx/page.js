"use client";
import TransactionsTable from "@/components/Tables/transactions";
import { useLatestData } from "@/components/contexts/latest_data";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Heading from "@/components/heading/Heading";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { InitStatus } from "@/constant/constant";
import getContractsGraph from "@/services/getContractsGraph";
import { formatMillionNumber } from "@/utils/commonFunctions";
import { Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  ActiveAccountToday,
  ContractTransactions,
  TotalTransactions,
} from "../../../../public/SvgIcons";
import "../blocks/blocksummary.scss";

const Transactionsummary = () => {
  const webSocketData = useLatestData();
  const { isNetworkChanged } = useGetNetwork();
  const [contractCount, setContractCount] = useState(0);
  const [txnData, setTxnData] = useState({});
  const [searchStatus, setSerachStatus] = useState(InitStatus);

  useEffect(() => {
    if (isNetworkChanged == false) {
      fetchContractData();
    }
  }, [isNetworkChanged]);

  const fetchContractData = () => {
    getContractsGraph()
      .then((res) => {
        setContractCount(res?.data);
      })
      .catch((err) => {
        return err;
      });
  };

  const data = [
    {
      img: <TotalTransactions />,
      label: "Total Transactions",
      value: webSocketData?.onChainMetric?.totalTx ? (
        <Tooltip placement="top" title={webSocketData?.onChainMetric?.totalTx}>
          {formatMillionNumber(Number(webSocketData?.onChainMetric?.totalTx))}
        </Tooltip>
      ) : txnData ? (
        formatMillionNumber(Number(txnData?.count))
      ) : (
        0
      ),
    },
    {
      img: <ContractTransactions />,
      label: "Transactions (Last 30 Days)",
      value: txnData
        ? formatMillionNumber(Number(txnData?.previous30DaysTrxn))
        : 0,
    },
    {
      img: <ActiveAccountToday />,
      label: "Active Accounts(Today)",
      value: txnData ? txnData?.activeAccount : 0,
    },
  ];

  return (
    <div className="blocksummary">
      <div className="container">
        <SearchbarComponent
          searchStatus={searchStatus}
          setSerachStatus={setSerachStatus}
        />
        <Heading heading="Transaction Summary" />
        <div className="blockdetail transdetails">
          <div className="innerdata bluecard">
            {data?.map((item, index) => (
              <React.Fragment key={index}>
                <div className="bluecard_inner">
                  <span className="imgIcon">{item?.img}</span>
                  <div>
                    <p>{item?.label}</p>
                    <h2>{item?.value}</h2>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Transactions Table */}
        <TransactionsTable setTxnData={setTxnData} />
      </div>
    </div>
  );
};

export default Transactionsummary;
