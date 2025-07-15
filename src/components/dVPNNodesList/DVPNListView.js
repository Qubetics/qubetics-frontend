'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { tableLimit } from "@/constant/constant";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import Pagination from "../Pagination/Pagination";
import { Datnotfound } from "../../../public/SvgIcons";

const nodesColumns = [
  { title: "Sr. NO", dataIndex: "index", key: "index" },
  { title: "dVPN Name", dataIndex: "name", key: "name" },
  { title: "Country", dataIndex: "country", key: "country" },
  { title: "Region", dataIndex: "region", key: "region" },
];

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

  const enrichedData = staticNodesData.map((item, index) => ({
    ...item,
    index: String(index + 1).padStart(2, "0"),
  }));

  const totalNodes = enrichedData.length;
  const totalPages = Math.ceil(totalNodes / tableLimit);
  const startIndex = (currentPage - 1) * tableLimit;
  const paginatedData = enrichedData.slice(startIndex, startIndex + tableLimit);

  const handleRowClick = (record) => {
    router.push(`/dVPNNodes/${record.id}`);
  };

  return (
    <div>
      <SkeletonTableWrapper
        columns={nodesColumns}
        dataSource={paginatedData}
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
