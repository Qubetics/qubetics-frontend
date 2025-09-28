"use client";
import React from "react";
import { Tabs } from "antd";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import ChainAbstractionAnalytics from "@/components/chainAbstractionAnalytics/ChainAbstractionAnalytics";
import ChainAbstractionTransaction from "@/components/chainAbstractionAnalytics/ChainAbstractionTransaction";
import "./chain-abstraction.scss";
import FilterResult from "@/components/FilterResult/FilterResult";

const ChainAbstraction = () => {
  const items = [
    {
      key: "transaction",
      label: "Transactions",
      children: <ChainAbstractionTransaction />,
    },
    {
      key: "analytics",
      label: "Analytics",
      children: <ChainAbstractionAnalytics />,
    },
  ];

  return (
    <section className="chain_abstraction">
      <div className="searchbar container">
        <FilterResult />
      </div>

      <div className="container ">
        <div className="chain_abstraction_tabs">
          <Tabs
            defaultActiveKey="transaction"
            className="commontabs"
            items={items}
          />
        </div>
      </div>
    </section>
  );
};

export default ChainAbstraction;
