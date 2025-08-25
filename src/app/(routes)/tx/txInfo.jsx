import React from "react";
import {
  ActiveAccountToday,
  ContractTransactions,
  TotalTransactions,
} from "../../../../public/SvgIcons";
import "../blocks/blocksummary.scss";
import { useTransactionStats } from "@/hooks/useTransactionStats";
import { formatValue, isEvmChain } from "@/components/header/helper";
export const TxInfo = ({ txnData }) => {
  const isEvm = isEvmChain();
  const { stats } = useTransactionStats({ isEvm });
  const {
    transactions_fee_24h,
    average_transactions_fee_24h,
    transactions_24h,
  } = stats || {};

  const data = [
    {
      img: <TotalTransactions />,
      label: isEvm
        ? transactions_24h?.title ?? "Transactions (24h)"
        : "Total Transactions",
      value: formatValue(
        isEvm ? transactions_24h?.value : txnData?.count,
        true
      ),
    },
    {
      img: <ContractTransactions />,
      label: isEvm
        ? transactions_fee_24h?.title ?? "Transactions fees (24h)"
        : "Transactions (Last 30 Days)",
      value: formatValue(
        isEvm ? transactions_fee_24h?.value : txnData?.previous30DaysTrxn,
        false,
        isEvm ? { suffix: " TICS" } : {}
      ),
    },
    {
      img: <ActiveAccountToday />,
      label: isEvm
        ? average_transactions_fee_24h?.title ?? "Avg. transaction fee (24h)"
        : "Active Accounts (Today)",
      value: formatValue(
        isEvm ? average_transactions_fee_24h?.value : txnData?.activeAccount,
        false,
        isEvm ? { prefix: "$" } : {}
      ),
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
