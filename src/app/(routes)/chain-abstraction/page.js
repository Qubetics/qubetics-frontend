// Destination: qubetics-frontend/src/app/(routes)/chain-abstraction/page.js
// This REPLACES the existing file (adds the Contracts tab + ?tab= sync).
"use client";
import React, { useState } from "react";
import { Tabs } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import ChainAbstractionAnalytics from "@/components/chainAbstractionAnalytics/ChainAbstractionAnalytics";
import ChainAbstractionTransaction from "@/components/chainAbstractionAnalytics/ChainAbstractionTransaction";
import ChainAbstractionContracts from "@/components/chainAbstractionAnalytics/ChainAbstractionContracts";
import "./chain-abstraction.scss";
import FilterResult from "@/components/FilterResult/FilterResult";

const ChainAbstraction = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "transaction");

  const items = [
    {
      key: "transaction",
      label: "Transactions",
      children: <ChainAbstractionTransaction />,
    },
    {
      key: "contracts",
      label: "Contracts",
      children: <ChainAbstractionContracts />,
    },
    {
      key: "analytics",
      label: "Analytics",
      children: <ChainAbstractionAnalytics />,
    },
  ];

  const handleTabChange = (key) => {
    setTab(key);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("tab", key);
    router.replace(`?${newSearchParams.toString()}`, {
      shallow: true,
      scroll: false,
    });
  };

  return (
    <section className="chain_abstraction">
      <div className="searchbar container">
        <FilterResult />
      </div>

      <div className="container ">
        <div className="chain_abstraction_tabs">
          <Tabs
            activeKey={tab}
            defaultActiveKey="transaction"
            className="commontabs"
            items={items}
            onChange={handleTabChange}
          />
        </div>
      </div>
    </section>
  );
};

export default ChainAbstraction;
