"use client";
import React, { useEffect, useState } from "react";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import { Datnotfound } from "../../../public/SvgIcons";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  Routes,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import getNodeDetails from "@/services/getNodeDetails";
import Link from "next/link";
import getAddress from "@/utils/getAddress";
import Pagination from "../Pagination/Pagination";

const txnColumns = [
  {
    title: "Txn Hash",
    dataIndex: "txhash",
    key: "txhash",
    render: (text) => (
      <Link
        className="bghash"
        href={`${Routes.Tx_Hash}${text}`}
        rel="noopener noreferrer"
      >
        {getAddress(text)}
      </Link>
    ),
  },
  {
    title: "Block",
    dataIndex: "blocknumber",
    key: "blocknumber",
    render: (text) => (
      <Link
        className=""
        href={`${Routes.BLOCK_NO}${text}`}
        rel="noopener noreferrer"
      >
        {text}
      </Link>
    ),
  },
  { title: "Type", dataIndex: "type", key: "type" },
  { title: "Amount", dataIndex: "value", key: "value" },
  { title: "Fee", dataIndex: "txFee", key: "txFee" },
  { title: "Timestamp", dataIndex: "timestamp", key: "timestamp" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <span className={`status ${[status.toLowerCase()]}`}>{status}</span>
    ),
  },
];

const DVPNNodesDetails = ({ nodeName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [nodeData, setNodeData] = useState();
  const [transactionStatus, setNodeStatus] = useState(InitStatus); //init,fetching,success,error

  const fetchNodeDetails = async () => {
    try {
      let response = await getNodeDetails(nodeName, currentPage, tableLimit);
      setNodeData(response?.data);
      setNodeStatus(SuccessStatus);
    } catch (err) {
      setNodeStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    if (nodeName) {
      setNodeStatus(FetchingStatus);
      fetchNodeDetails();
    }
  }, [currentPage, nodeName]);

  return (
    <div>
      <SkeletonTableWrapper
        columns={txnColumns}
        dataSource={nodeData?.result}
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
