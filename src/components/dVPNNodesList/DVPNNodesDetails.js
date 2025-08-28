"use client";
import React, { useEffect, useState } from "react";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import { Datnotfound } from "../../../public/SvgIcons";
import {
  currencyName,
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
import { convertToDateTime, renderTime } from "@/utils/renderTime";

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
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (type) =>
      type
        ? type
          .toLowerCase()
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
        : "-",
  },
  {
    title: "Amount",
    dataIndex: "value",
    key: "value",
    render: (value) => `${value ? value : 0} ${currencyName}`
  },
  {
    title: "Fee",
    dataIndex: "txFee",
    key: "txFee",
    render: (value) => {
      return value || "-";
    },
  },
  {
    title: "Timestamp ",
    dataIndex: "timestamp",
    key: "timestamp",
    render: (_,text) =>
      text?.timestamp ? (
        <span className="timestamp">
          {renderTime(text?.timestamp)}
          <span>{convertToDateTime(text?.timestamp)}</span>
        </span>
      ) : text?.createdAt ? (
        <span className="timestamp">
          {renderTime(text?.createdAt)}
          <span>{convertToDateTime(text?.createdAt)}</span>
        </span>
      ) : (
        "-"
      ),
  },
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
  const [totalPages, setTotalPages] = useState(0);


  const fetchNodeDetails = async () => {
    try {
      let response = await getNodeDetails(nodeName, currentPage, tableLimit);
      setNodeData(response?.data);
      setNodeStatus(SuccessStatus);
      const count = Number(response?.data?.total_count ?? 0) / tableLimit;

      setTotalPages(Math.ceil(count ?? 0));
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

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleFirst = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(1);
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  };

  return (
    <>
      <div>
        <SkeletonTableWrapper
          columns={txnColumns}
          dataSource={nodeData?.result}
          isSkeleton={
            transactionStatus === FetchingStatus ||
            transactionStatus === InitStatus
          }
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
        {totalPages > 1 ? (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            disablePrev={currentPage === 1}
            disableNext={currentPage === totalPages}
            handleFirst={handleFirst}
            handleLast={handleLast}
          />
        ) : null}
      </div>
    </>
  );
};

export default DVPNNodesDetails;
