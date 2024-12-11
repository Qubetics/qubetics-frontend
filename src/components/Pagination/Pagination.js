import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import React from "react";
import "./Pagination.scss";

function Pagination({
  totalPages,
  currentPage,
  handleNext,
  handlePrevious,
  disablePrev,
  disableNext,
  handleFirst,
  handleLast,
}) {
  return (
    <div className="pagination">
      <div
        style={{
          color: currentPage === 1 ? "gray" : "white",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
        }}
        onClick={currentPage !== 1 ? handleFirst : undefined}
      >
        First
      </div>
      <div
        className={`leftArrow ${disablePrev && "disable"}`}
        onClick={handlePrevious}
      >
        <LeftOutlined />
      </div>
      <div className="centerDetail">
        <h5 className="countin">{currentPage}</h5>/
        <h5 className="allCounting">{totalPages}</h5>
      </div>
      <div
        className={`rightArrow ${disableNext && "disable"}`}
        onClick={handleNext}
      >
        <RightOutlined />
      </div>
      <div
        style={{
          color: currentPage == totalPages ? "gray" : "white",
          cursor: currentPage == totalPages ? "not-allowed" : "pointer",
        }}
        onClick={currentPage < totalPages ? handleLast : undefined}
      >
        Last
      </div>
    </div>
  );
}

export default Pagination;
