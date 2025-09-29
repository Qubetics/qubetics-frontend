"use client";
import { useParams } from "next/navigation";
import {
  ActiveUsers,
  HrsEarnings,
  LastCheckedIn,
  RecentSession,
  Searchicon,
  TotalEarnings,
  TotalUsers,
} from "../../../../../public/SvgIcons";
import Heading from "@/components/heading/Heading";
import "../node.scss";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import UptimeHistory from "./UptimeHistory";
import DVPNNodesDetails from "@/components/dVPNNodesList/DVPNNodesDetails";
import {
  currencyName,
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";
import getNodeDetailSummary from "@/services/getNodeDetailSummary";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/components/header/helper";
import Loader from "@/components/loader/Loader";
import FilterResult from "@/components/FilterResult/FilterResult";

const Page = () => {
  const { nodesDetails: nodeName } = useParams();
  const [nodeSummaryStatus, setsetNodeSummaryStatus] = useState(InitStatus);
  const [nodeSummary, setNodeSummary] = useState();

  const fetchNodeSummary = async () => {
    try {
      let response = await getNodeDetailSummary(nodeName);
      setNodeSummary(response?.data);
      setsetNodeSummaryStatus(SuccessStatus);
    } catch (err) {
      setsetNodeSummaryStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    if (nodeName) {
      setsetNodeSummaryStatus(FetchingStatus);
      fetchNodeSummary();
    }
  }, [nodeName]);

  return (
    <>
      {nodeSummaryStatus === InitStatus ||
        nodeSummaryStatus === FetchingStatus ? (
        <Loader />
      ) : (
        <div className="container nodeDetail">
          <div className="searchbar searchFilter">
            <FilterResult />
          </div>
          <Heading heading="Node Details" />
          <div className="nodeDetail_top">
            <p>Address :</p>
            <strong>{nodeName}</strong>
          </div>
          <div className="nodeGraph">
            <div className="nodeGraph_left">
              {" "}
              <UptimeHistory graphdashboard nodeName={nodeName} />
            </div>
            <div className="nodeGraph_right">
              {" "}
              <CardsOnchain
                text="Total Earnings"
                balance={`${Number(nodeSummary?.total_earning || 0).toFixed(2)} ${currencyName}`}
                img={<TotalEarnings />}
                title={`The total lifetime earnings generated in ${currencyName}`}
              />
              <CardsOnchain
                text="24hrs Earnings"
                balance={`${Number(nodeSummary?.daily_earnings || 0).toFixed(2)} ${currencyName}`}
                img={<HrsEarnings />}
                title={`Total rewards earned in the last 24 hours in ${currencyName}.`}
              />
              <CardsOnchain
                text="Total Sessions"
                balance={`${nodeSummary?.total_users || 0}`}
                img={<TotalUsers />}
                title="The total number of unique users who have ever connected to this node"
              />
              <CardsOnchain
                text="Active Sessions"
                balance={`${nodeSummary?.active_users || 0}`}
                img={<ActiveUsers />}
                title="The number of users currently connected and active on this node."
              />
              <CardsOnchain
                text="Last Checked In"
                balance={`${formatDateTime(nodeSummary?.last_checked) || 0}`}
                img={<LastCheckedIn />}
                title="The most recent time this node’s status was verified."
              />
              <CardsOnchain
                text="Recent Session"
                balance={`${formatDateTime(nodeSummary?.recent_session) || 0}`}
                img={<RecentSession />}
                title="The timestamp of the latest user session on this node."
              />
            </div>
          </div>
          <DVPNNodesDetails nodeName={nodeName} />
        </div>
      )}
    </>
  );
};

export default Page;
