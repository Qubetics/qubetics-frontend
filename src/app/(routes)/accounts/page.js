"use client";
import { useState } from "react";
import { Select, Tabs } from "antd";
import FilterResult from "@/components/FilterResult/FilterResult";
import AccountSummary from "./AccountSummary";
import "./account.scss";
import AccountsTxn from "./AccountsTxn";
import ActiveUsers from "./ActiveUsers";

const Page = () => {
  const [activeTab, setActiveTab] = useState("0");
  const [order, setOrder] = useState("desc");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleChange = (value) => {
    setOrder(value);
  };

  const tabItems = [
    {
      label: <span>Accounts</span>,
      key: "0",
      children: <AccountsTxn order={order} activeTab={activeTab} />,
    },
    {
      label: <span>Active Users</span>,
      key: "1",
      children: <ActiveUsers  reverse={order==="desc"} activeTab={activeTab}/>,
    },
  ];

  return (
    <div className="container">
      <FilterResult />
      <h2 className="analytictext">Accounts Summary</h2>
      <AccountSummary />
      <div className="accountTabs">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          className="commontabs nodetabs"
          items={tabItems}
          tabBarExtraContent={
              <Select
                value={order}
                onChange={handleChange}
                className="customSelect"
                options={[
                  { value: "desc", label: "Newest" },
                  { value: "asc", label: "Oldest" },
                ]}
              />
          }
        />
      </div>
    </div>
  );
};

export default Page;
