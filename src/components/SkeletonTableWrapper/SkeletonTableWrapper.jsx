import { Skeleton, Table } from "antd";
import Image from "next/image";
import notFound from "../../assets/svg/notFount.svg";
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
      <Skeleton
        key={1}
        active
        paragraph={{ rows: 5 }}
        title={false}
        className=""
      />
      <Skeleton
        key={2}
        active
        paragraph={{ rows: 5 }}
        title={false}
        className="custom-skeleton"
      />
      <Skeleton
        key={3}
        active
        paragraph={{ rows: 5 }}
        title={false}
        className="custom-skeleton"
      />
      <Skeleton
        key={4}
        active
        paragraph={{ rows: 5 }}
        title={false}
        className="custom-skeleton"
      />
    </div>
  );

  return (
    <>
      {isSkeleton ? (
        renderSkeleton()
      ) : (
        <Table
          {...props}
          rowKey="id"
          className={className}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          showHeader={dataSource !== undefined && dataSource?.length > 0}
          locale={{
            emptyText: (
              <div>
                <Image src={notFound} width={150} height={90} alt="img" />

                <p>No Data</p>
              </div>
            ),
          }}
          // Hide pagination during loading
          //   rowKey={(record) => record.key}
        />
      )}
    </>
  );
};
