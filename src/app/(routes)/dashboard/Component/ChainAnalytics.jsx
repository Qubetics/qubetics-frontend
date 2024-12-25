import ChainAnalytics from "@/components/chainAnalytics/ChainAnalytics";
import ChainAnalyticsGraph from "@/components/chainAnalytics/ChainAnalyticsGraph";
import { graphUrl } from "@/constant/constant";
import React from "react";

 const OnChainAnalytics = ({ stats }) => {
  return (
    <div className="analyticsSec">
      <h2 className="analytictext">On Chain Analytics</h2>
      <div className="innerSec">
        <ChainAnalytics stats={stats} />
        <div className="multiGraph">
          <div className="grap">
            <ChainAnalyticsGraph
              title="Qubetics Price"
              discription="Qubetics coin current market price in USD "
              fetchUrl={graphUrl.token_price}
              isNative={false}
            />
            <ChainAnalyticsGraph
              title="Qubetics Coin Transfer"
              discription="Total Txns made with Qubetics coin per period "
              fetchUrl={graphUrl.coin_transfer}
              isNative={false}
            />
          </div>
          <div className="grap">
            <ChainAnalyticsGraph
              title="Total Accounts"
              discription="Total accounts number per period"
              fetchUrl={graphUrl.total_account}
              isNative={true}
            />
            <ChainAnalyticsGraph
              title="Transaction Fees"
              discription="Amount of Qubetics coins paid in fees per period "
              fetchUrl={graphUrl.txn_fee}
              isNative={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default OnChainAnalytics;