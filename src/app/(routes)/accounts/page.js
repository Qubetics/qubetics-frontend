"use client";
import { useState } from "react";
import { Select, Space, Tabs } from "antd";
import FilterResult from "@/components/FilterResult/FilterResult";
import AccountSummary from "./AccountSummary";
import "./account.scss";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import { Datnotfound } from "../../../../public/SvgIcons";
import { currencyName } from "@/constant/constant";
import AccountsTxn from "./AccountsTxn";
import ActiveUsers from "./ActiveUsers";

const activeUsersColumns = [
  { title: "Sr no", dataIndex: "sr", key: "sr" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "Bandwidth Consumed", dataIndex: "bandwidth", key: "bandwidth" },
  { title: "Txn Count", dataIndex: "txn", key: "txn" },
];

const activeUsersData = [22, 12, 34, 15, 10, 10, 15, 12, 12, 12, 12].map(
  (txn, i) => ({
    key: i + 1,
    sr: `#${i + 1}`,
    address: "qube1fl48vsnmsdzcv85q5d2q4z5ajdha8yu3wqlkac",
    bandwidth: "10%",
    txn,
  })
);

const Page = () => {
  const [activeTab, setActiveTab] = useState("0");
  const [tokensTxData, setTokensTxData] = useState([]);
  const [order, setOrder] = useState("desc"); // default to "Newest"

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
      children: (
        <AccountsTxn
          setTokensTxData={setTokensTxData}
          tokensTxData={tokensTxData}
          order={order}
        />
      ),
    },
    {
      label: <span>Active Users</span>,
      key: "1",
      children: (
        <ActiveUsers
          setTokensTxData={setTokensTxData}
          tokensTxData={tokensTxData}
        />
      ),
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
            activeTab === "0" && ( // Only show select for Accounts tab
              <Select
                value={order}
                onChange={handleChange}
                className="customSelect"
                options={[
                  { value: "desc", label: "Newest" },
                  { value: "asc", label: "Oldest" },
                ]}
              />
            )
          }
        />
      </div>
    </div>
  );
};

export default Page;