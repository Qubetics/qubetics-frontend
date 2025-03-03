"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import "../contractDetailTabs/ContractDtlTabs.scss";
import AnalyticToken from "../analyticdetailtab/AnalyticToken";
import AnalyticHistoric from "../analyticdetailtab/AnalyticHistoric";
function AnalyticTab({ hash }) {
 
  const items = [
    {
      key: "1",
      label: "Token Contract Overview",
      children: <AnalyticToken address ={hash} />,
    },

    {
      key: "2",
      label: "Historical Price",
      children: <AnalyticHistoric />,
    },
  ];
  return (
    <>
      <div className="contractDetailTabs">
        <Tabs defaultActiveKey="1" items={items} />
      </div>
    </>
  );
}

export default AnalyticTab;
