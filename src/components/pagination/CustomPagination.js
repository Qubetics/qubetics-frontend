"use client";
import React, { useState } from "react";
import { Pagination } from "antd";

const CustomPagination = ({
  total,
  currentPage,
  pageSize,
  handlePageChange,
}) => (
  <>
    <Pagination
      className="custompagination"
      showSizeChanger={pageSize}
      onShowSizeChange={pageSize}
      defaultCurrent={currentPage}
      total={total}
      onChange={handlePageChange}
    />
  </>
);
export default CustomPagination;
