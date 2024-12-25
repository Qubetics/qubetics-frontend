import { FetchingStatus, InitStatus, tableLimit } from "@/constant/constant";
import { nodesColumns } from "@/constant/graphTableValues";
import { useState } from "react";
import { Datnotfound } from "../../assets/svg/SvgIcons";
import Pagination from "../Pagination/Pagination";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";

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
      <SkeletonTableWrapper
        columns={nodesColumns}
        dataSource={paginatedData}
        isSkeleton={
          nodesStatus === FetchingStatus || nodesStatus === InitStatus
        }
        pagination={false}
        className="commontable"
      />
      {nodesData.length > 1 && (
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
