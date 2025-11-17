"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ErrorStatus, FetchingStatus, InitStatus, SuccessStatus, tableLimit } from "@/constant/constant";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import Pagination from "../Pagination/Pagination";
import { Datnotfound } from "../../../public/SvgIcons";
import getNodeList from "@/services/getNodeList";
import { getOffset } from "@/utils/commonFunctions";
import CopyText from "../DoCopy/CopyText";

const staticNodesData = [
  {
    id: "node-1",
    name: "Tics-thunder-archive",
    country: "USA",
    region: "California",
  },
  {
    id: "node-2",
    name: "Tics-thunder-archive",
    country: "China",
    region: "Hong Kong",
  },
  {
    id: "node-3",
    name: "Tics-thunder-archive",
    country: "India",
    region: "Mumbai",
  },
  {
    id: "node-4",
    name: "Tics-thunder-archive",
    country: "Germany",
    region: "Berlin",
  },
  {
    id: "node-5",
    name: "Tics-thunder-archive",
    country: "USA",
    region: "New York",
  },
];

const DVPNListView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [reverse, setReverse] = useState(false);
  const [nodeData, setNodeData] = useState();
  const [nodeStatus, setNodeStatus] = useState(InitStatus); //init,fetching,success,error

  const enrichedData = staticNodesData.map((item, index) => ({
    ...item,
    index: String(index + 1).padStart(2, "0"),
  }));
  const totalNodes = nodeData?.total || 0;
  const totalPages = Math.ceil(totalNodes / tableLimit);
  const startIndex = (currentPage - 1) * tableLimit;
  const paginatedData = enrichedData.slice(startIndex, startIndex + tableLimit);

  const handleRowClick = (record) => {
    router.push(`/dVPNNodes/${record.address}?status=${record.status}`);
  };

  const fetchNodeList = async () => {
    try {
      let response = await getNodeList(currentPage, tableLimit, reverse);
      const offset = getOffset(currentPage, tableLimit);
      const updatedNodes = response?.data?.nodes?.map((node, index) => {
        return {
          sr: offset + index + 1,
          ...node,
          status: node.status || "active",
        };
      });
      const value = { ...response?.data, nodes: updatedNodes };
      setNodeData(value);
      setNodeStatus(SuccessStatus);
    } catch (err) {
      setNodeStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    setNodeStatus(FetchingStatus);
    fetchNodeList();
  }, [currentPage]);
  const nodesColumns = (totalNodes) => [
    {
      title: `Node Address (${totalNodes || 0})`,
      dataIndex: "address",
      key: "address",
      render: (address) => (
        <div className="dvpnAddressCopy">
          <span className="bghash">{address}</span>
          <span
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <CopyText text={address} />
          </span>
        </div>
      ),
    },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Region",
      dataIndex: "city",
      key: "city",
      render: (city, record) => {
        return city !== "Unknown" ? city : record.country ? record.country : "Unknown";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color = status === "active" ? "green" : "red";
        const text = status === "active" ? "Active" : "Inactive";
        return <span style={{ color, fontWeight: 600 }}>{text}</span>;
      },
    },
  ];
  return (
    <div>
      <SkeletonTableWrapper
        columns={nodesColumns(totalNodes)}
        dataSource={nodeData?.nodes}
        isSkeleton={nodeStatus === InitStatus || nodeStatus === FetchingStatus}
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
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
      />
      {totalNodes > tableLimit && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleNext={() => setCurrentPage(currentPage + 1)}
          handlePrevious={() => setCurrentPage(currentPage - 1)}
          disablePrev={currentPage === 1}
          disableNext={currentPage === totalPages}
          handleFirst={() => setCurrentPage(1)}
          handleLast={() => setCurrentPage(totalPages)}
        />
      )}
    </div>
  );
};

export default DVPNListView;
