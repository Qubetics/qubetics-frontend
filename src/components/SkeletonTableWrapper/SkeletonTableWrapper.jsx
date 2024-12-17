import { Skeleton, Table } from "antd";
import React, { useState } from "react";
import "../TableLoader/TableLoader.scss";
export const SkeletonTableWrapper = ({
  columns,
  dataSource,
  isSkeleton = true,
  className,
  ...props
}) => {

  const renderSkeleton = () => (
    <div className="tableLoader" data-testid="skeleton-container">
      <Skeleton active paragraph={{ rows: 5 }} title={false} className="" />
      <Skeleton
        active
        paragraph={{ rows: 5 }}
        title={false}
        className="custom-skeleton"
      />
      <Skeleton
        active
        paragraph={{ rows: 5 }}
        title={false}
        className="custom-skeleton"
      />
      <Skeleton
        active
        paragraph={{ rows: 5 }}
        title={false}
        className="custom-skeleton"
      />
    </div>
  );

  return (
    <>
      {
      isSkeleton ? (
        renderSkeleton()
      ) : (
        <Table
          {...props}
          className={className}
          columns={columns}
          dataSource={dataSource}
          pagination={false} // Hide pagination during loading
          //   rowKey={(record) => record.key}
        />
      )}
    </>
  );
};
