// Destination: qubetics-frontend/src/components/chainAbstractionAnalytics/ChainAbstractionContracts.js
"use client";

import { useEffect, useState } from "react";
import { Table, Tooltip } from "antd";
import Link from "next/link";
import { Routes } from "@/constant/constant";
import { SuccesIcon, PendingIcon } from "../../../public/SvgIcons";
import CopyText from "../DoCopy/CopyText";
import getAddress from "@/utils/getAddress";
import { convertToDateTime } from "@/utils/renderTime";
import { formatMillionNumber, noExponential } from "@/utils/commonFunctions";
import getChainAbstractionContracts from "@/services/getChainAbstractionContracts";
import "./ChainAbstractionAnalytics.scss";

const ChainAbstractionContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const result = await getChainAbstractionContracts();
      setContracts(result?.data?.contracts || []);
    } catch (err) {
      console.error("Error fetching QCA contracts", err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => (
        <Link className="fromicon" href={`${Routes.QCA_CONTRACTS}${record?.address}`}>
          {record?.name || "-"}
        </Link>
      ),
    },
    {
      title: "Address",
      key: "address",
      render: (_, record) =>
        record?.address ? (
          <span className="iconandlink addressText">
            <Tooltip title={record?.address}>
              <Link href={`${Routes.QCA_CONTRACTS}${record?.address}`}>
                {getAddress(record?.address)}
              </Link>
            </Tooltip>
            <CopyText text={record?.address} />
          </span>
        ) : (
          "-"
        ),
    },
    {
      title: "Type",
      key: "tag",
      render: (_, record) => (
        <span className="qcaTag">{record?.tag || "Chain Abstraction"}</span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) =>
        record?.verificationType && record?.verificationType > 0 ? (
          <div className="verificationFill greenFill">
            <SuccesIcon />
            <span>Verified</span>
          </div>
        ) : (
          <div className="verificationFill">
            <PendingIcon />
            <span>Pending</span>
          </div>
        ),
    },
    {
      title: "Balance",
      key: "balance",
      render: (_, record) => (
        <span>
          {formatMillionNumber(
            noExponential(Number(record?.balance) / 10 ** 18 || 0),
          )}{" "}
          TICS
        </span>
      ),
    },
    {
      title: "Txn Count",
      key: "txCount",
      render: (_, record) => <span>{record?.txCount ?? 0}</span>,
    },
    {
      title: "Last Activity",
      key: "lastActivityAt",
      render: (_, record) => (
        <span className="timestamp">
          {record?.lastActivityAt
            ? convertToDateTime(record?.lastActivityAt)
            : "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="abstraction_contracts">
      <Table
        scroll={{ x: "max-content" }}
        columns={columns}
        dataSource={contracts}
        loading={loading}
        pagination={false}
        rowKey="address"
        className="commontable custom-transaction-table"
      />
    </div>
  );
};

export default ChainAbstractionContracts;
