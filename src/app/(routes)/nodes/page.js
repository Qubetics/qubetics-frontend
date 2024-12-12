"use client";
import ListView from "@/components/nodes/ListView";
import {
  ErrorStatus,
  InitStatus,
  SuccessStatus
} from "@/constant/constant";
import getNodes from "@/services/getAllNodes";
import { useEffect, useState } from "react";
import "../blocks/blocksummary.scss";
import QubeticNetworkNode from "./QubeticNetworkNode";

const Nodes = () => {
  const [nodesStatus, setNodesStatus] = useState(InitStatus);
  const [nodesData, setNodesData] = useState([]);
  const [totalNodes, setTotalNodes] = useState(0);
  const [countryNode, setCountryNode] = useState();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // setNodesStatus(FetchingStatus);
        let response = await getNodes();
        if (response?.error === false) {
          setNodesData(response?.data?.globeLocDetail);
          setTotalNodes(response?.data?.total);
          setCountryNode(response?.data);
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
  useEffect(() => {
    let newArr = nodesData?.map((v, index) => ({ ...v, index: index + 1 }));
    setData(newArr);
  }, [nodesData]);

  return (
    <div>
      <div className="blocksummary nodes">
        <div className="container">
          <QubeticNetworkNode nodesData={nodesData} countryNode={countryNode} />{" "}
          <div className="listViewTable">
            <ListView
              nodesData={data}
              nodesStatus={nodesStatus}
              totalNodes={totalNodes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nodes;
