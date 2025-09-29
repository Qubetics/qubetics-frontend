"use client";
import { Skeleton } from "antd";
import React from "react";
import "./TableLoader.scss";

function TableLoader() {
  return (
    <div className="tableLoader" data-testid="skeleton-container">
      <Skeleton
        active
        paragraph={{ rows: 5 }}
        title={false}
        className=""
      />
      <Skeleton
        className="custom-skeleton"
        active
        paragraph={{ rows: 5 }}
        title={false}
      />
        <Skeleton
        className="custom-skeleton"
        active
        paragraph={{ rows: 5 }}
        title={false}
      />
        <Skeleton
        className="custom-skeleton"
        active
        paragraph={{ rows: 5 }}
        title={false}
      />
    </div>
  );
}

export default TableLoader;
