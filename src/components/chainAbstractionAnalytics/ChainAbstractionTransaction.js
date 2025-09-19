"use client";

import { useEffect, useState } from "react";
import { Table } from "antd";
import { useRouter } from "next/navigation";
import "./ChainAbstractionAnalytics.scss";
import GetChainAbstractionTransaction from "@/services/getChainAbstractionTx"; // API call
import Pagination from "@/components/Pagination/Pagination"; // custom Pagination component
import { pageNo, tableLimit } from "@/constant/constant"; // Default pagination constants
import CopyText from "../DoCopy/CopyText";
import { convertToDateTime } from "@/utils/renderTime";
import getAddress from "@/utils/getAddress";
import {
  checkStatus,
  destinationTxn,
  formatToken,
  getTokenIcon,
  noExponential,
} from "@/utils/commonFunctions";
import Link from "next/link";

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
      setTransactions(result?.data?.intentList);

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

  const destinationClick = (type, value) => {
    const routeTo = destinationTxn(type?.toLowerCase(), value);
    routeTo && router.push(routeTo);
  };

  const columns = [
    {
      title: "Intent Transaction",
      dataIndex: "intentTx",
      key: "intentTx",
      render: (_, record) =>
        record?.intent_hash ? (
          <div className="tx-cell">
            <span className="tx-link">
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
      render: (_, record) => (
        <div className="token-cell">
          {/* <span>
            {record?.sourceToken === "btc" ? (
              <BNBIcon />
            ) : record?.sourceToken === "tics" ? (
              <Image src={tics} alt="qubetics logo" width={30} height={30} />
            ) : (
              ""
            )}
          </span> */}

          <div className="token-cell-in">
            <p>
              {getTokenIcon(record?.source_token)}
              {formatToken(
                record?.source_token?.toLowerCase(),
                noExponential(record?.source_amount)
              )}{" "}
              {record?.source_token?.toUpperCase()}
            </p>
            {/* <span className="chain-tag">
              <h3>{record?.sourceToken}</h3>
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
          {/* <span>
            {record?.targetToken === "btc" ? (
              <BNBIcon />
            ) : record?.targetToken === "tics" ? (
              <Image src={tics} alt="qubetics logo" width={30} height={30} />
            ) : (
              ""
            )}
          </span> */}
          <div className="token-cell-in">
            <p>
              {getTokenIcon(record?.target_token)}
              {formatToken(
                record?.target_token?.toLowerCase(),
                noExponential(record?.amount)
              )}{" "}
              {record?.target_token?.toUpperCase()}
            </p>
            {/* <span className="chain-tag">
              <h3>{record?.targetToken}</h3>
              <ArrowUpicon />
            </span> */}
          </div>
        </div>
      ),
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
            <span className="tx-link">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent navigation
                  destinationClick(record?.targetChain, record?.solver_tx_hash);
                }}
              >
                {getAddress(record?.solver_tx_hash)}
              </Link>
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
            router.push(`/chain-abstraction/${record?.intent_id}`);
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
