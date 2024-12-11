import React from "react";

import TransactionHistory from "../Graphs/TransactionHistory";

const Analytics = () => {
  return (
    <>
      {/* ----------Transaction History Graph-------------- */}
      <TransactionHistory graphdashboard={true} dashnotfound={true} />
    </>
  );
};

export default Analytics;
