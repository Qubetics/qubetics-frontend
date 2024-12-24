"use client";

import ChainAnalytics from "@/components/chainAnalytics/ChainAnalytics";
import ChainAnalyticsGraph from "@/components/chainAnalytics/ChainAnalyticsGraph.jsx";
import Analytics from "@/components/dashboard/OnChainMetrics/Analytics";
import OnChainMetrics from "@/components/dashboard/OnChainMetrics/OnChainMetrics";
import RecentBlocks from "@/components/dashboard/RecentBlocks/RecentBlocks";
import RecentTransactions from "@/components/dashboard/RecentTransactions/RecentTransactions";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { graphUrl, InitStatus, Routes } from "@/constant/constant";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import FooterLink from "../../../components/footer/FooterLinks";
import "../../../index.scss";
import "./dashboard.scss";
import getStatistics from "@/services/getStatistics";
import { useGetNetwork } from "@/components/contexts/networkChanged";

const Page = ({ customClass }) => {
  const [routeName, setRouteName] = useState("");
  const pathname = usePathname();
  const [searchStatus, setSerachStatus] = useState(InitStatus);
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
  }, []);
  return (
    <>
      <section
        style={{ paddingTop: pathname !== Routes.HOME && 0 }}
        className={`cardsLandingPage ${customClass} ${
          routeName === pathname ? "dashboardMain" : ""
        }`}
      >
        <div>
          <SearchbarComponent
            searchStatus={searchStatus}
            setSerachStatus={setSerachStatus}
          />

          <div className="container">
            <h2 className="analytictext">On Chain Metrics</h2>
            <OnChainMetrics stats={stats} />
          </div>
        </div>
        <div className="container">
          {/* OnChain Metrics data */}
          {/* Transaction History And Analytics */}
          <div className="transactionHistoryCard">
            <Analytics />
            <div className="cardsLandingPage_details">
              <RecentTransactions />
              <RecentBlocks />
            </div>
          </div>
          {/* ----------Analtics Cards------------------ */}
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
                    discription="Total TXNs made with Qubetics coin per period "
                    fetchUrl={graphUrl.coin_transfer}
                    isNative={false}
                  />
                </div>
                <div className="grap">
                  <ChainAnalyticsGraph
                    title="Total Accounts"
                    discription="Total accounts number per period"
                    fetchUrl={graphUrl.total_account}
                    isNative={isEvm}
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
