"use client";

import { useEffect, useState } from "react";
import { Table } from "antd";
import { useRouter } from "next/navigation";
import "./ChainAbstractionAnalytics.scss";
import { ArrowUpicon, BNBIcon, CopyIcons } from "../../../public/SvgIcons";
import GetChainAbstractionTransaction from "@/services/getChainAbstractionTx"; // API call
import Pagination from "@/components/Pagination/Pagination"; // custom Pagination component
import { pageNo, tableLimit } from "@/constant/constant"; // Default pagination constants

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

    const result = await GetChainAbstractionTransaction(currentPage, tableLimit);

    if (result?.Data?.intentList) {
      const transformed = result.Data.intentList.map((item, index) => ({
        key: index,
        sender: item.sender,
        path: item.path,
        nonce: item.nonce,
        intentTx: item.intentHash || "0x...",
        date: new Date().toLocaleString(),
        source: {
          amount: item.amount ? (item.amount / 1e18).toFixed(4) : "0.00",
          symbol: item.sourceToken || "BNB",
          icon: <BNBIcon />,
          chain: item.sourceChain || "Unknown",
        },
        destination: {
          amount: item?.amount ? (item.amount / 1e18).toFixed(4) : "0.00",
          symbol: item.targetToken || "BNB",
          icon: <BNBIcon />,
          chain: item.targetChain || "Unknown",
        },
        status: item.status === 1 ? "Pending" : "Completed",
        destTx: item.solverTxHash || "0x...",
      }));

      setTransactions(transformed);

      const count = Number(result?.Data?.total ?? 0)
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
              router.push(`/transactionOverview/${record.intentTx}`)
            }
            style={{ cursor: "pointer", color: "#1890ff" }}
          >
            {record.intentTx}
            <button className="copy_btn">
              <CopyIcons />
            </button>
          </span>
          <div className="tx-date">{record.date}</div>
        </div>
      ),
    },
    {
      title: "Source Token",
      key: "source",
      render: (_, record) => (
        <div className="token-cell">
          <span>{record.source.icon}</span>
          <div className="token-cell-in">
            <p>
              {record.source.amount} {record.source.symbol}
            </p>
            <span className="chain-tag">
              <h3>{record.source.chain}</h3>
              <ArrowUpicon />
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Destination Token",
      key: "destination",
      render: (_, record) => (
        <div className="token-cell">
          <span>{record.destination.icon}</span>
          <div className="token-cell-in">
            <p>
              {record.destination.amount} {record.destination.symbol}
            </p>
            <span className="chain-tag">
              <h3>{record.destination.chain}</h3>
              <ArrowUpicon />
            </span>
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
            {record.destTx}
            <button className="copy_btn">
              <CopyIcons />
            </button>
          </span>
          <div className="tx-date">{record.date}</div>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => <span className="view-action">View</span>,
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
