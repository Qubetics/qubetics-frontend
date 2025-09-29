import React from "react";

import TransactionHistory from "../Graphs/TransactionHistory";

const Analytics = ({stats}) => {
  return (
    <>
      {/* ----------Transaction History Graph-------------- */}
      <TransactionHistory graphdashboard={true} dashnotfound={true} stats={stats} />
    </>
  );
};

export default Analytics;
