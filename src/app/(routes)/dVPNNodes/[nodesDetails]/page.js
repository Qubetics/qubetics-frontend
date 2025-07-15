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

const staticNodesData = [
  {
    id: "node-1",
    name: "Tics-thunder-archive",
    country: "USA",
    region: "California",
  },
  {
    id: "node-2",
    name: "Tics-thunder-archive",
    country: "China",
    region: "Hong Kong",
  },
  {
    id: "node-3",
    name: "Tics-thunder-archive",
    country: "India",
    region: "Mumbai",
  },
  {
    id: "node-4",
    name: "Tics-thunder-archive",
    country: "Germany",
    region: "Berlin",
  },
  {
    id: "node-5",
    name: "Tics-thunder-archive",
    country: "USA",
    region: "New York",
  },
];

const Page = () => {
  const { nodesDetails } = useParams();
  const node = staticNodesData.find((item) => item.id === nodesDetails);

  if (!node) return <div style={{ padding: "2rem" }}>Node not found</div>;

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
        <strong>{node.name}</strong>
      </div>
      <div className="nodeGraph">
        <div className="nodeGraph_left">
          {" "}
          <UptimeHistory graphdashboard />
        </div>
        <div className="nodeGraph_right">
          {" "}
          <CardsOnchain
            text="Total Earnings"
            balance="71,290 TICS"
            img={<TotalEarnings />}
          />
          <CardsOnchain
            text="24hrs Earnings"
            balance="726 TICS"
            img={<HrsEarnings />}
          />
          <CardsOnchain text="Total Users" balance="20K" img={<TotalUsers />} />
          <CardsOnchain
            text="Active Users"
            balance="23"
            img={<ActiveUsers />}
          />
          <CardsOnchain
            text="Last Checked In"
            balance="30 days ago"
            img={<LastCheckedIn />}
          />
          <CardsOnchain
            text="Recent Session"
            balance="23 mins ago"
            img={<RecentSession />}
          />
        </div>
      </div>
      <DVPNNodesDetails />
    </div>
  );
};

export default Page;
