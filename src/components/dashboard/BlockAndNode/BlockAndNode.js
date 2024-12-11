import React, { useState, useEffect } from "react";
import CountdownTimer from "@/components/countdown/CountdownTimer";
import getNodes from "@/services/getAllNodes";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";
import { BLOCK_TIME } from "@/constant/constant";

const BlockAndNode = () => {
  const [nodes, setNodes] = useState();

  useEffect(() => {
    getNodes().then((res) => {
      setNodes(res?.data?.total);
    });
  }, []);

  return (
    <div className="count_chart">
      <div className="coiundown_withchart">
        <h3>Block Time</h3>
        <CountdownTimer  time={BLOCK_TIME} />
      </div>
      <div className="coiundown_withchart">
        <h3>No. of Active Nodes</h3>
        <h1>{nodes ? Number(nodes) : 0}</h1>
        <button className="activeBtn">
          <span></span>Active
        </button>
      </div>
    </div>
  );
};

export default BlockAndNode;
