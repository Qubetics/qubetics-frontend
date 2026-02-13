"use client";
import { useEffect, useState } from "react";
import { Select, Tabs } from "antd";
import FilterResult from "@/components/FilterResult/FilterResult";
import AccountSummary from "./AccountSummary";
import "./account.scss";
import AccountsTxn from "./AccountsTxn";
import ActiveUsers from "./ActiveUsers";
import getActiveUsers from "@/services/getActiveUsers";
import { tableLimit } from "@/constant/constant";

const Page = () => {
  const [activeTab, setActiveTab] = useState("0");
  const [txnCount, setTxnCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [order, setOrder] = useState("desc");

  const fetchActiveUsersCount = async () => {
    const res = await getActiveUsers(1, tableLimit);

    if (res?.data) {
      setActiveUsersCount(
        Number(res.data?.pagination?.total ?? res.data?.sessions?.length ?? 0),
      );
    }
  };

  useEffect(() => {
    fetchActiveUsersCount();
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleChange = (value) => {
    setOrder(value);
  };

  const tabItems = [
    {
      label: <span>Accounts ({txnCount})</span>,
      key: "0",
      children: (
        <AccountsTxn
          order={order}
          activeTab={activeTab}
          onCountChange={setTxnCount}
        />
      ),
    },
    {
      label: <span>Active Sessions ({activeUsersCount})</span>,
      key: "1",
      children: (
        <ActiveUsers
          reverse={order === "desc"}
          activeTab={activeTab}
          onCountChange={setActiveUsersCount}
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
