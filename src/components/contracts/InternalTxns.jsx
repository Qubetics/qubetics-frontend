"use-client";
import { internalTxns } from "@/constant/graphTableValues";
import Image from "next/image";
import notFound from "../../assets/svg/notFount.svg";
import Pagination from "../Pagination/Pagination";
import { SkeletonTableWrapper } from "../SkeletonTableWrapper/SkeletonTableWrapper";
import useEvmTransactionInternalTxsNextOnly from "@/hooks/useInternalTxn";

const InternalTxns = ({ hash, tab, isEvm }) => {
  const {
    internalTxns: transaction,
    intMeta,
    intStatus,
    intIsLoading,
    intCurrentPage,
    intItemsCount,
    intFetchFirstPage,
    intFetchNextPage,
  } = useEvmTransactionInternalTxsNextOnly({
    updateTx: hash,
    autoLoad: true,
    isEvm,
  });
  return (
    <div>
      <SkeletonTableWrapper
        isSkeleton={intIsLoading}
        columns={internalTxns}
        dataSource={transaction}
        pagination={false}
        className="commontable contractTable"
        locale={{
          emptyText: (
            <div>
              <Image src={notFound} width={150} height={90} />
              <p>No data </p>
            </div>
          ),
        }}
      />
      {isEvm && transaction.length >= 50 && (
        <Pagination
          currentPage={intCurrentPage}
          handleNext={intFetchNextPage}
          disablePrev={intCurrentPage == 1}
          disableNext={transaction.length < 50}
          handleFirst={intFetchFirstPage}
          isEvm={isEvm}
        />
      )}
    </div>
    // ) : (
    //   <Page />
  );
};

export default InternalTxns;
