"use client";
import { useParams, useSearchParams } from "next/navigation";
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
import { currencyName, ErrorStatus, FetchingStatus, InitStatus, SuccessStatus } from "@/constant/constant";
import getNodeDetailSummary from "@/services/getNodeDetailSummary";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/components/header/helper";
import Loader from "@/components/loader/Loader";
import FilterResult from "@/components/FilterResult/FilterResult";
import { formatToTwoDecimals } from "@/utils/commonFunctions";
import { Tooltip } from "antd";
import CopyText from "@/components/DoCopy/CopyText";

const Page = () => {
  const { nodesDetails: nodeName } = useParams();
  const searchParams = useSearchParams();
  const nodeStatus = searchParams.get("status") || "active";
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
      {nodeSummaryStatus === InitStatus || nodeSummaryStatus === FetchingStatus ? (
        <Loader />
      ) : (
        <div className="container nodeDetail">
          <div className="searchbar searchFilter">
            <FilterResult />
          </div>
          <Heading heading="Node Details" status={nodeStatus} />
          <div className="nodeDetail_top">
            <p>Address:</p>
            <div className="nodeDetail_top_address">
            <strong>{nodeName}</strong>
            <CopyText text={nodeName} />
            </div>
          </div>
          <div className="nodeGraph">
            <div className="nodeGraph_left">
              {" "}
              <UptimeHistory graphdashboard nodeName={nodeName} />
            </div>
            <div className="nodeGraph_right">
              <CardsOnchain
                text="Total Earnings"
                balance={
                  <Tooltip title={`${nodeSummary?.total_earning || 0} ${currencyName}`}>
                    <span>{`${formatToTwoDecimals(nodeSummary?.total_earning || 0)} ${currencyName}`}</span>
                  </Tooltip>
                }
                img={<TotalEarnings />}
                title={`The total lifetime earnings generated in ${currencyName}`}
              />
              <CardsOnchain
                text="24hrs Earnings"
                balance={
                  <Tooltip title={`${nodeSummary?.daily_earnings || 0} ${currencyName}`}>
                    <span>{`${formatToTwoDecimals(nodeSummary?.daily_earnings || 0)} ${currencyName}`}</span>
                  </Tooltip>
                }
                img={<HrsEarnings />}
                title={`Total rewards earned in the last 24 hours in ${currencyName}.`}
              />
              <CardsOnchain
                text="Total Sessions"
                balance={`${nodeSummary?.total_sessions || 0}`}
                img={<TotalUsers />}
                title="The total number of sessions created on this node"
              />
              <CardsOnchain
                text="Active Sessions"
                balance={`${nodeSummary?.active_sessions || 0}`}
                img={<ActiveUsers />}
                title="The total number of active sessions created on this node"
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
