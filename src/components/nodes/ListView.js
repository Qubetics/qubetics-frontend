import React, { useEffect, useState } from "react";
import { Table } from "antd";
import {
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { nodesColumns } from "@/constant/graphTableValues";
import Loader from "../loader/Loader";
import Page from "@/app/(routes)/notfound/page";
import Pagination from "../Pagination/Pagination";
import { Datnotfound } from "../../../public/SvgIcons";

const ListView = ({ nodesData, nodesStatus, totalNodes }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalNodes / tableLimit);

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
    if (currentPage <= totalPages) {
      setCurrentPage(1);
    }
  };

  // Slicing the data for pagination
  const startIndex = (currentPage - 1) * tableLimit;
  const paginatedData = nodesData.slice(startIndex, startIndex + tableLimit);

  return (
    <div>
      <Table
        columns={nodesColumns}
        dataSource={paginatedData}
        pagination={false}
        className="commontable"
        locale={{
          emptyText: (
            <div>
              <Datnotfound />
              <p>No data </p>
            </div>
          ),
        }}
      />
      {nodesData.length > 10 && (
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
      )}
    </div>
  );
};

export default ListView;
