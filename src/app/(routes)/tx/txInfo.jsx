
import { Tooltip } from "antd";
import React from "react";
import {
  ActiveAccountToday,
  ContractTransactions,
  TotalTransactions,
} from "../../../../public/SvgIcons";
import { useLatestData } from "@/components/contexts/latest_data";
import "../blocks/blocksummary.scss";
export const TxInfo = ({ txnData }) => {
  const webSocketData = useLatestData();
  const data = [
    {
      img: <TotalTransactions />,
      label: "Total Transactions",
      value: webSocketData?.onChainMetric?.totalTx ? (
        <Tooltip placement="top" title={webSocketData?.onChainMetric?.totalTx}>
          {Number(webSocketData?.onChainMetric?.totalTx).toLocaleString()}
        </Tooltip>
      ) : txnData?.count ? (
        Number(txnData?.count).toLocaleString()
      ) : (
        0
      ),
    },
    {
      img: <ContractTransactions/>,
      label: "Transactions (Last 30 Days)",
      value: txnData?.previous30DaysTrxn
        ? Number(txnData?.previous30DaysTrxn).toLocaleString()
        : 0,
    },
    {
      img: <ActiveAccountToday />,
      label: "Active Accounts (Today).",
      value: txnData?.activeAccount
        ? txnData?.activeAccount.toLocaleString()
        : 0,
    },
  ];
  return (
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
  );
};
