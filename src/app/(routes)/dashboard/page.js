"use client";
import OnChainMetrics from "@/components/dashboard/OnChainMetrics/OnChainMetrics";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { InitStatus, Routes } from "@/constant/constant";
import { useDashStats } from "@/hooks/useDashStats";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "../../../index.scss";
import { AnalyticsDetails } from "./Component/Analytics";
import "./dashboard.scss";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/loader/Loader";

const OnChainAnalytics = dynamic(() => import("./Component/ChainAnalytics"), {
  ssr: true,
});

const Page = ({ customClass }) => {
  const pathname = usePathname();
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const { dashStats } = useDashStats();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <section
          style={{ paddingTop: pathname !== Routes.HOME && 0 }}
          className={`cardsLandingPage
           ${customClass} 
           ${pathname === Routes.DASHBOARD && "dashboardMain"}
        `}
        >
          <div>
            <SearchbarComponent
              searchStatus={searchStatus}
              setSerachStatus={setSerachStatus}
            />
            <div className="container">
              <h2 className="analytictext">On Chain Metrics</h2>
              <OnChainMetrics stats={dashStats} />
            </div>
          </div>
          <div className="container">
            <AnalyticsDetails />
            <OnChainAnalytics stats={dashStats} />
          </div>
        </section>
      </Suspense>
    </>
  );
};

export default Page;
