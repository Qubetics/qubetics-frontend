"use client";
import React from "react";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import { Datnotfound } from "../../../public/SvgIcons";

const txnColumns = [
  { title: "Txn Hash", dataIndex: "txnHash", key: "txnHash" },
  { title: "Block", dataIndex: "block", key: "block" },
  { title: "Type", dataIndex: "type", key: "type" },
  { title: "Amount", dataIndex: "amount", key: "amount" },
  { title: "Fee", dataIndex: "fee", key: "fee" },
  { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <span className={`status ${[status.toLowerCase()]}`}>
        {status}
      </span>
    ),
  },
];

const staticTxnData = [
  {
    txnHash: "0x47685...4c8B145",
    block: "4675553",
    type: "Start Request",
    amount: "-",
    fee: "0.00234 TICS",
    timestamp: "4 days 21 hrs ago",
    status: "Success",
  },
  {
    txnHash: "0x47685...4c8B145",
    block: "4675553",
    type: "Start Request",
    amount: "-",
    fee: "0.00234 TICS",
    timestamp: "4 days 21 hrs ago",
    status: "Pending",
  },
  {
    txnHash: "0x47685...4c8B145",
    block: "4675553",
    type: "End Request",
    amount: "More",
    fee: "0.00234 TICS",
    timestamp: "4 days 21 hrs ago",
    status: "Failed",
  },
  {
    txnHash: "0x47685...4c8B145",
    block: "4675553",
    type: "End Request",
    amount: "More",
    fee: "0.00234 TICS",
    timestamp: "4 days 21 hrs ago",
    status: "Success",
  },
  {
    txnHash: "0x47685...4c8B145",
    block: "4675553",
    type: "End Request",
    amount: "More",
    fee: "0.00234 TICS",
    timestamp: "4 days 21 hrs ago",
    status: "Success",
  },
  {
    txnHash: "0x47685...4c8B145",
    block: "4675553",
    type: "Start Request",
    amount: "-",
    fee: "0.00234 TICS",
    timestamp: "4 days 21 hrs ago",
    status: "Failed",
  },
  {
    txnHash: "0x47685...4c8B145",
    block: "4675553",
    type: "Start Request",
    amount: "-",
    fee: "0.00234 TICS",
    timestamp: "4 days 21 hrs ago",
    status: "Success",
  },
  {
    txnHash: "0x47685...4c8B145",
    block: "4675553",
    type: "Start Request",
    amount: "-",
    fee: "0.00234 TICS",
    timestamp: "4 days 21 hrs ago",
    status: "Pending",
  },
  {
    txnHash: "0x47685...4c8B145",
    block: "4675553",
    type: "End Request",
    amount: "More",
    fee: "0.00234 TICS",
    timestamp: "4 days 21 hrs ago",
    status: "Success",
  },
];

const DVPNNodesDetails = () => {
  return (
    <div>
      <SkeletonTableWrapper
        columns={txnColumns}
        dataSource={staticTxnData}
        isSkeleton={false}
        pagination={false}
        className="commontable"
        locale={{
          emptyText: (
            <div>
              <Datnotfound />
              <p>No data</p>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default DVPNNodesDetails;
