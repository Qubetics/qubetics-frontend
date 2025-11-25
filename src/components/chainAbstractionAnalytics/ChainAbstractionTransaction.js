"use client";

import { useEffect, useState } from "react";
import { Table, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import "./ChainAbstractionAnalytics.scss";
import GetChainAbstractionTransaction from "@/services/getChainAbstractionTx"; // API call
import Pagination from "@/components/Pagination/Pagination"; // custom Pagination component
import { explorerHyperLInk, pageNo, tableLimit } from "@/constant/constant"; // Default pagination constants
import CopyText from "../DoCopy/CopyText";
import { convertToDateTime } from "@/utils/renderTime";
import getAddress from "@/utils/getAddress";
import {
  checkStatus,
  formatToken,
  getExplorerUrl,
  getTokenIcon,
  getTooltipContent,
  noExponential,
} from "@/utils/commonFunctions";
import Link from "next/link";

const ChainAbstractionTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [currentPage, setCurrentPage] = useState(pageNo); // Track witch page we're on
  const [totalPages, setTotalPages] = useState(1); // total number of pages
  const router = useRouter(); // for navigation

  useEffect(() => fetchIntents(), [currentPage]);

  const fetchIntents = async () => {
    setLoading(true);
    setTransactions([]);

    const result = await GetChainAbstractionTransaction(
      currentPage,
      tableLimit
    );

    if (result?.data?.intentList) {
      setTransactions(result?.data?.intentList);

      const count = Number(result?.data?.total || 0);
      setTotalPages(Math.ceil(count / tableLimit));
    }

    setLoading(false);
  };

  // ✅ Custom Pagination Handlers
  const handleNext = () => {
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    currentPage > 1 && setCurrentPage(currentPage - 1);
  };

  const handleLast = () => {
    currentPage < totalPages && setCurrentPage(totalPages);
  };
  const handleFirst = () => currentPage > 1 && setCurrentPage(1);

  const handleTransactionClick = (network, transactionHash) => {
    const explorerUrl = getExplorerUrl(network, transactionHash);
    if (explorerUrl) {
      window.open(explorerUrl, "_blank", "noopener,noreferrer");
    }
  };

  const columns = [
    {
      title: "Intent Transaction",
      dataIndex: "intentTx",
      key: "intentTx",
      render: (_, record) =>
        record?.intent_hash ? (
          <div className="tx-cell">
            <span className="tx-link addressText">
              <Link href={`/chain-abstraction/${record?.intent_hash}`}>
                {getAddress(record?.intent_hash)}
              </Link>
              <button className="copy_btn">
                <CopyText text={record?.intent_hash} />
              </button>
            </span>
            <div className="tx-date">
              {convertToDateTime(record?.created_at)}
            </div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Source Token",
      key: "source",
      render: (_, record) => {
        const rawValue = record?.source_amount;
        const formatted = formatToken(
          record?.source_token?.toLowerCase(),
          noExponential(rawValue)
        );

        const tooltipContent = getTooltipContent(
          record?.source_token,
          rawValue,
          formatted
        );

        return (
          <div className="token-cell">
            <div className="token-cell-in token-destination">
              <span className="token-icons">
                {getTokenIcon(record?.source_token)}
              </span>
              <div className="right-token-text">
                <Tooltip title={tooltipContent} placement="top">
                  <p style={{ cursor: "pointer" }}>
                    {formatted} {record?.source_token?.toUpperCase()}
                  </p>
                </Tooltip>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Destination Token",
      key: "destination",
      render: (_, record) => {
        const rawValue = record?.amount;
        const formatted = formatToken(
          record?.target_token?.toLowerCase(),
          noExponential(rawValue)
        );

        const tooltipContent = getTooltipContent(
          record?.target_token,
          rawValue,
          formatted
        );

        return (
          <div className="token-cell">
            <div className="token-cell-in token-destination">
              <span className="token-icons">
                {getTokenIcon(record?.target_token)}
              </span>
              <div className="right-token-text">
                <Tooltip title={tooltipContent} placement="top">
                  <p style={{ cursor: "pointer" }}>
                    {formatted} {record?.target_token?.toUpperCase()}
                  </p>
                </Tooltip>
                {explorerHyperLInk(
                  record?.target_token,
                  record?.solver_tx_hash
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "intent_update_status",
      key: "intent_update_status",
      render: (status) => (
        <p className={`status-tag-${checkStatus(status)}`}>
          {checkStatus(status)}
        </p>
      ),
    },
    {
      title: "Destination Transaction",
      key: "destTx",
      render: (_, record) =>
        record?.solver_tx_hash ? (
          <div className="tx-cell">
            <span className="tx-link addressText">
              <a
                className="link-pointer"
                style={{
                  cursor: "pointer",
                  color: "var(--primary-color)", // Use your app's link color
                }}
                onClick={() => {
                  handleTransactionClick(
                    record?.target_chain,
                    record?.solver_tx_hash
                  );
                }}
              >
                {getAddress(record?.solver_tx_hash)}
              </a>
              <button className="copy_btn">
                <CopyText text={record?.solver_tx_hash} />
              </button>
            </span>
            <div className="tx-date">
              {convertToDateTime(record?.updated_at)}
            </div>
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span
          className="view-action pointer"
          onClick={() => {
            router.push(`/chain-abstraction/${record?.intent_hash}`);
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
