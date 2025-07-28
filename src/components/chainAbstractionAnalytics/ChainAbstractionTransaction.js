"use client";

import { useEffect, useState } from "react";
import { Table } from "antd";
import { useRouter } from "next/navigation";
import "./ChainAbstractionAnalytics.scss";
import { ArrowUpicon, BNBIcon } from "../../../public/SvgIcons";
import GetChainAbstractionTransaction from "@/services/getChainAbstractionTx"; // API call
import Pagination from "@/components/Pagination/Pagination"; // custom Pagination component
import {
  formatPrecision,
  isStringValue,
  pageNo,
  tableLimit,
} from "@/constant/constant"; // Default pagination constants
import CopyText from "../DoCopy/CopyText";
import { convertToDateTime } from "@/utils/renderTime";
import getAddress from "@/utils/getAddress";


const ChainAbstractionTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(pageNo); // Track witch page we're on
  const [totalPages, setTotalPages] = useState(1); // total number of pages
  const router = useRouter(); // for navigation

  useEffect(() => {
    fetchIntents();
  }, [currentPage]);

  const fetchIntents = async () => {
    setLoading(true);
    setTransactions([]);

    const result = await GetChainAbstractionTransaction(
      currentPage,
      tableLimit
    );

    if (result?.data?.intentList) {
      const transformed = result?.data?.intentList?.map((item, index) => ({
        key: index,
        sender: item?.sender,
        path: item?.path,
        nonce: item?.nonce,
        intentTx: item?.intentHash
        ? item?.intentHash
        : isStringValue(item?.intentHash),
        source: {
          amount: formatPrecision(item?.amount),
          symbol: item?.sourceToken || "BNB",
          icon: <BNBIcon />,
          chain: item?.sourceChain || "Unknown",
        },
        destination: {
          amount: formatPrecision(item?.amount),
          symbol: item?.targetToken || "BNB",
          icon: <BNBIcon />,
          chain: item?.targetChain || "Unknown",
        },
        status: item?.status === 1 ? "Pending" : "Completed",
        destTx: item?.solverTxHash
        ? item?.solverTxHash
        : isStringValue(item?.solverTxHash),
        create_at: item?.created_at
        ? convertToDateTime(item?.created_at)
        : isStringValue(item?.created_at),
      update_at: item?.updated_at
        ? convertToDateTime(item?.updated_at)
        : isStringValue(item?.updated_at),
      }));

      setTransactions(transformed);

      const count = Number(result?.data?.total || 0);
      setTotalPages(Math.ceil(count / tableLimit));
    }

    setLoading(false);
  };

  // ✅ Custom Pagination Handlers
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

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  };

  const handleFirst = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
    }
  };

  const columns = [
    {
      title: "Intent Transaction",
      dataIndex: "intentTx",
      key: "intentTx",
      render: (_, record) => (
        <div className="tx-cell">
          <span
            className="tx-link"
            onClick={() =>
              router.push(`/chain-abstraction/${record?.intentTx}`)
            }
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            {getAddress(record?.intentTx)}
            <button className="copy_btn">
              <CopyText text={record?.intentTx} />
            </button>
          </span>
          <div className="tx-date">{record?.create_at}</div>
        </div>
      ),
    },
    {
      title: "Source Token",
      key: "source",
      render: (_, record) => (
        <div className="token-cell">
          <span>{record?.source?.icon}</span>
          <div className="token-cell-in">
            <p>
              {record?.source?.amount} {record?.source?.symbol}
            </p>
            {/* <span className="chain-tag">
              <h3>{record.source.chain}</h3>
              <ArrowUpicon />
            </span> */}
          </div>
        </div>
      ),
    },
    {
      title: "Destination Token",
      key: "destination",
      render: (_, record) => (
        <div className="token-cell">
          <span>{record?.destination?.icon}</span>
          <div className="token-cell-in">
            <p>
              {record?.destination?.amount}
              {record?.destination?.symbol}
            </p>
            {/* <span className="chain-tag">
              <h3>{record.destination.chain}</h3>
              <ArrowUpicon />
            </span> */}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <p className="status-tag">{status}</p>,
    },
    {
      title: "Destination Transaction",
      key: "destTx",
      render: (_, record) => (
        <div className="tx-cell">
          <span>
            {getAddress(record?.destTx)}
            <button className="copy_btn">
              <CopyText text={record?.destTx} />
            </button>
          </span>
          <div className="tx-date">{record?.update_at}</div>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span
          className="view-action"
          onClick={() => {
            router.push(`/chain-abstraction/${record?.intentTx}`);
          }}
        >
          View
        </span>
      ),
    },
  ];

  return (
    <div className="abstraction_transaction">
      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={transactions}
        loading={loading}
        pagination={false}
        className="commontable custom-transaction-table"
      />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        disablePrev={currentPage === 1}
        disableNext={currentPage === totalPages}
        handleFirst={handleFirst}
        handleLast={handleLast}
        pageSize={2}
      />
    </div>
  );
};

export default ChainAbstractionTransaction;
