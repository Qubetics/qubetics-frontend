import { Tooltip } from "antd";
import React from "react";
import {
  ActiveAccountToday,
  ContractTransactions,
  TotalTransactions,
} from "../../../../public/SvgIcons";
import "../blocks/blocksummary.scss";
export const TxInfo = ({ txnData }) => {
  // const webSocketData = useLatestData();
  const data = [
    {
      img: <TotalTransactions />,
      label: "Total Transactions",
      value: txnData?.count ? (
        <Tooltip
          placement="top"
          title={Number(txnData?.count).toLocaleString()}
        >
          {Number(txnData?.count).toLocaleString()}
        </Tooltip>
      ) : (
        0
      ),
    },
    {
      img: <ContractTransactions />,
      label: "Transactions (Last 30 Days)",
      value: txnData?.previous30DaysTrxn
        ? Number(txnData?.previous30DaysTrxn).toLocaleString()
        : 0,
    },
    {
      img: <ActiveAccountToday />,
      label: "Active Accounts (Today)",
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
