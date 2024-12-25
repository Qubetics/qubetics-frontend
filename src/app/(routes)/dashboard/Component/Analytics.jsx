import Analytics from "@/components/dashboard/OnChainMetrics/Analytics";
import RecentBlocks from "@/components/dashboard/RecentBlocks/RecentBlocks";
import RecentTransactions from "@/components/dashboard/RecentTransactions/RecentTransactions";
import React from "react";

export const AnalyticsDetails = () => {
  return (
    <div className="transactionHistoryCard">
      <Analytics />
      <div className="cardsLandingPage_details">
        <RecentTransactions />
        <RecentBlocks />
      </div>
    </div>
  );
};
