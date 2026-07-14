// Destination: qubetics-frontend/src/components/chainAbstractionAnalytics/ChainAbstractionContracts.js
"use client";

import { useEffect, useState } from "react";
import { Table, Tooltip } from "antd";
import Link from "next/link";
import {
  Routes,
  pageNo,
  tableLimit,
} from "@/constant/constant";
import { SuccesIcon, PendingIcon } from "../../../public/SvgIcons";
import CopyText from "../DoCopy/CopyText";
import getAddress from "@/utils/getAddress";
import { convertToDateTime } from "@/utils/renderTime";
import getAllContracts from "@/services/getAllContracts";
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
      const result = await getAllContracts(
        pageNo,
        tableLimit,
        "",
        "chain-abstraction",
      );
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
          {record?.contractname || record?.contractName || "-"}
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
      key: "contractType",
      render: (_, record) => (
        <span className="qcaTag">
          {record?.contractType && record?.contractType !== "UNKNOWN"
            ? record?.contractType
            : "Chain Abstraction"}
        </span>
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
      title: "Last Activity",
      key: "timestamp",
      render: (_, record) => (
        <span className="timestamp">
          {record?.timestamp ? convertToDateTime(record?.timestamp) : "-"}
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
