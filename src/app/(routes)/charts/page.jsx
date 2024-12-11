import AccountsAndContracts from "@/components/dashboard/Graphs/AccountsAndContracts";
import TokenAndTransactionGraph from "@/components/dashboard/Graphs/TokenAndTransactionGraph";
import React from "react";


const Stats = () => {
  return (
    <div>
      <div className="container">
        {/*Account and Contracts Graph*/}

        <AccountsAndContracts />
        {/*Token And Transaction Graph*/}
        <TokenAndTransactionGraph />

        {/*
            <ChartStatsMain/>
            */}
      </div>
    </div>
  );
};

export default Stats;
