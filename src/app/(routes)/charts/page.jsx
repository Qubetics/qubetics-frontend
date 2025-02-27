import AccountsAndContracts from "@/components/dashboard/Graphs/AccountsAndContracts";
import TokenAndTransactionGraph from "@/components/dashboard/Graphs/TokenAndTransactionGraph";
import React from "react";


const Stats = () => {
  return (
    <div>
      <div className="container">
        <AccountsAndContracts />
        <TokenAndTransactionGraph />
      </div>
    </div>
  );
};

export default Stats;
