"use client";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import { graphUrl, Routes } from "@/constant/constant";
import getStatistics from "@/services/getStatistics";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import "../../../index.scss";
import "./dashboard.scss";
import dynamic from "next/dynamic";

const RecentTransactions = dynamic(
  () => import("@/components/dashboard/RecentTransactions/RecentTransactions"),
  { ssr: false }
);
const RecentBlocks = dynamic(
  () => import("@/components/dashboard/RecentBlocks/RecentBlocks"),
  { ssr: false }
);
const ChainAnalyticsGraph = dynamic(
  () => import("@/components/chainAnalytics/ChainAnalyticsGraph"),
  { ssr: false }
);
const FilterResult = dynamic(
  () => import("@/components/FilterResult/FilterResult"),
  { ssr: false }
);
const OnChainMetrics = dynamic(
  () => import("@/components/dashboard/OnChainMetrics/OnChainMetrics"),
  { ssr: false }
);
const ChainAnalytics = dynamic(
  () => import("@/components/chainAnalytics/ChainAnalytics"),
  { ssr: false }
);
const FooterLink = dynamic(() => import("@/components/footer/FooterLinks"), {
  ssr: false,
});
const Loading = dynamic(() => import("../../loading"), { ssr: false });
const Analytics = dynamic(
  () => import("@/components/dashboard/OnChainMetrics/Analytics"),
  { ssr: false }
);

const Page = ({ customClass }) => {
  const [routeName, setRouteName] = useState("");
  const pathname = usePathname();
  const [stats, setStats] = useState("");
  const { isEvm, isNetworkChanged } = useGetNetwork();

  useEffect(() => {
    if (pathname === Routes.DASHBOARD) {
      setRouteName(pathname);
    }
  }, [pathname]);

  const fetchEVMStats = async () => {
    try {
      let respose = await getStatistics();
      setStats(respose?.data);
    } catch (err) {
      return err;
    }
  };
  useEffect(() => {
    fetchEVMStats();
  }, [isNetworkChanged]);
  return (
    <>
      <section
        style={{ paddingTop: pathname !== Routes.HOME && 0 }}
        className={`cardsLandingPage ${customClass} ${
          routeName === pathname ? "dashboardMain" : ""
        }`}
      >
        <div>
          <div className="container">
            <FilterResult />
            <h2 className="analytictext">On-Chain Metrics</h2>
            <OnChainMetrics stats={stats} />
          </div>
        </div>
        <div className="container">
          {/* OnChain Metrics data */}
          {/* Transaction History And Analytics */}
          <div className="transactionHistoryCard">
            <Suspense fallback={<Loading />}>
              <Analytics stats={stats} />
            </Suspense>
            <div className="cardsLandingPage_details">
              <RecentTransactions />
              <RecentBlocks />
            </div>
          </div>
          {/* ----------Analtics Cards------------------ */}
          <div className="analyticsSec">
            <h2 className="analytictext">On-Chain Analytics</h2>
            <div className="innerSec">
              <ChainAnalytics stats={stats} />
              <div className="multiGraph">
                <div className="grap">
                  <Suspense fallback={<Loading />}>
                    <ChainAnalyticsGraph
                      title="Qubetics Price"
                      discription="Qubetics Coin current market price in USD "
                      fetchUrl={graphUrl.token_price}
                      isNative={false}
                      tooltipTitle="Price"
                    />
                    <ChainAnalyticsGraph
                      title="Qubetics Coin Transfers"
                      discription="Total Txns made with Qubetics coin per period "
                      fetchUrl={graphUrl.coin_transfer}
                      isNative={false}
                      tooltipTitle="Transfer"
                    />
                  </Suspense>
                </div>
                <div className="grap">
                  <Suspense fallback={<Loading />}>
                    <ChainAnalyticsGraph
                      title="Total Accounts"
                      discription="Total accounts number per period"
                      fetchUrl={graphUrl.total_account}
                      isNative={isEvm}
                      tooltipTitle="Account"
                    />
                    <ChainAnalyticsGraph
                      title="Transaction Fees"
                      discription="Amount of Qubetics coin paid in fees per period "
                      fetchUrl={graphUrl.txn_fee}
                      isNative={false}
                      tooltipTitle="Txn Fee"
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {pathname !== Routes.DASHBOARD && (
        <div className="footerToShow">
          <FooterLink />
        </div>
      )}
    </>
  );
};

export default Page;
