"use client";
import { ErrorStatus, FetchingStatus, InitStatus, SuccessStatus } from "@/constant/constant";
import { useEffect, useState } from "react";
import "../blocks/blocksummary.scss";
import QubeticNetworkNode from "./QubeticNetworkNode";
import DVPNListView from "@/components/dVPNNodesList/DVPNListView";
import { getNodePerformanceData } from "@/services/getNodePerformance";

const Page = () => {
  const [nodesStatus, setNodesStatus] = useState(InitStatus);
  const [nodesData, setNodesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setNodesStatus(FetchingStatus);
        let response = await getNodePerformanceData();
        if (!response?.error) {
          setNodesData(response?.data);;
          setNodesStatus(SuccessStatus);
        } else {
          setNodesStatus(ErrorStatus);
        }
      } catch (err) {
        setNodesStatus(ErrorStatus);
        return err;
      }
    };
    fetchData();
  }, []);
  

  return (
    <div>
      <div className="blocksummary nodes">
        <div className="container">
          <QubeticNetworkNode nodesData={nodesData}  />{" "}
          <div className="listViewTable">
            <DVPNListView />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
