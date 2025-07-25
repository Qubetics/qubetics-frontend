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
  ErrorStatus,
  FetchingStatus,
  SuccessStatus,
} from "@/constant/constant";
import getNodeDetailSummary from "@/services/getNodeDetailSummary";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/components/header/helper";

const Page = () => {
  const { nodesDetails: nodeName } = useParams();
  const [nodeSummaryStatus, setsetNodeSummaryStatus] = useState("");
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
    <div className="container nodeDetail">
      <div className="searchbar searchFilter">
        <div className="searchbar_input">
          <input placeholder="Search by Txn Hash/ Address/ Block/ Block Hash" />
          <Searchicon />
        </div>
      </div>
      <Heading heading="Node Detail" />
      <div className="nodeDetail_top">
        <p>Name :</p>
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
            balance={`${nodeSummary?.total_earning} TICS`}
            img={<TotalEarnings />}
          />
          <CardsOnchain
            text="24hrs Earnings"
            balance={`${nodeSummary?.daily_earnings} TICS`}
            img={<HrsEarnings />}
          />
          <CardsOnchain
            text="Total Users"
            balance={`${nodeSummary?.total_users}`}
            img={<TotalUsers />}
          />
          <CardsOnchain
            text="Active Users"
            balance={`${nodeSummary?.active_users}`}
            img={<ActiveUsers />}
          />
          <CardsOnchain
            text="Last Checked In"
            balance={`${formatDateTime(nodeSummary?.last_checked)}`}
            img={<LastCheckedIn />}
          />
          <CardsOnchain
            text="Recent Session"
            balance={`${formatDateTime(nodeSummary?.recent_session)}`}
            img={<RecentSession />}
          />
        </div>
      </div>
      <DVPNNodesDetails nodeName={nodeName} />
    </div>
  );
};

export default Page;
