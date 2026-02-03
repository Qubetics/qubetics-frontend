"use client";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Heading from "@/components/heading/Heading";
import Pagination from "@/components/Pagination/Pagination";
import FilterResult from "@/components/FilterResult/FilterResult";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { blockColumn } from "@/constant/graphTableValues";
import getBlocks from "@/services/getBlocks";
import { Select, Space } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BlockInfo } from "./BlockInfo";
import "./blocksummary.scss";

const BlockSummary = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isNetworkChanged } = useGetNetwork();
  const [blocksData, setBlocksData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageToSend, setPageToSend] = useState(1);
  const [nextCursor, setNextCursor] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState();
  const [previousCursor, setPreviousCursor] = useState(1);
  const [blockSummaryStatus, setBlockSummaryStatus] = useState(InitStatus);

  const page = searchParams.get("page") || 1;
  const pageid = searchParams.get("id") || 1;
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState("desc");
  const filterBy = searchParams.get("filterBy") || "newest";

  // const { isLight } = useThemeData();

  const fetchData = async () => {
    try {
      setLoading(true);
      setBlockSummaryStatus(FetchingStatus);
      let response = await getBlocks(pageid, tableLimit, filterBy, order);

      if (response?.error === false) {
        setBlocksData(response?.data?.blocks);
        setPreviousCursor(response?.data?.prevCursor);
        setNextCursor(response?.data?.nextCursor);
        setLastPage(response?.data?.lastPage);
        setBlockSummaryStatus(SuccessStatus);
        const count = Number(response?.data?.blockCount ?? 0) / tableLimit;
        setTotalPages(Math.ceil(count ?? 0));
        setLoading(false);
      } else {
        throw new Error("Blocks not found");
      }
    } catch (err) {
      setBlockSummaryStatus(ErrorStatus);
      setLoading(false);
      return err;
    }
  };

  const handleChange = (value) => {
    // setFilterVal(value);
    setCurrentPage(1);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", 1);
    newSearchParams.set("id", 1);
    newSearchParams.set("filterBy", value);
    if (value === "newest") setOrder("desc");
    else {
      setOrder("asc");
    }
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", Number(page) + 1);
      newSearchParams.set("id", nextCursor);
      newSearchParams.set("filterBy", filterBy);
      if (filterBy === "newest") setOrder("desc");
      else {
        setOrder("asc");
      }
      router.push(`?${newSearchParams.toString()}`);
    }
  };
  const handlePrevious = () => {
    if (page > 1) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", Number(page) - 1);
      newSearchParams.set("id", previousCursor);
      newSearchParams.set("filterBy", filterBy);
      if (filterBy === "oldest") setOrder("desc");
      else {
        setOrder("asc");
      }
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleLast = () => {
    if (page < totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", totalPages);
      newSearchParams.set("id", lastPage);
      newSearchParams.set("filterBy", filterBy);
      if (filterBy === "newest") setOrder("desc");
      else {
        setOrder("asc");
      }
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleFirst = () => {
    if (page <= totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", 1);
      newSearchParams.set("id", 1);
      newSearchParams.set("filterBy", filterBy);
      if (filterBy === "oldest") setOrder("asc");
      else {
        setOrder("desc");
      }
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  useEffect(() => {
    if (isNetworkChanged) {
      setCurrentPage(1);
      setPageToSend(1);
      fetchData();
    }
  }, [isNetworkChanged]);

  useEffect(() => {
    fetchData();
  }, [pageid, filterBy]);

  const getBlockCount = () => {
    if (filterBy === "oldest") {
      return `Showing blocks from ${blocksData[0]?.blocknumber} to ${
        blocksData[blocksData.length - 1]?.blocknumber
      }`;
    }
    return `Showing blocks from ${
      blocksData[blocksData.length - 1]?.blocknumber
    } to ${blocksData[0]?.blocknumber}`;
  };
  return (
    <div className="blocksummary">
      <div className="container">
        <FilterResult />
        <Heading heading={"Block Summary"} />
        <BlockInfo blocksData={blocksData} />
        <div className="totalTransactions">
          {blocksData.length > 0 && (
            <>
              <h2>{getBlockCount()}</h2>

              <Space wrap>
                <Select
                  title=""
                  onChange={handleChange}
                  defaultValue="newest"
                  style={{
                    width: 123,
                  }}
                  className="innerSelect"
                  options={[
                    {
                      value: "newest",
                      label: "Newest",
                    },
                    {
                      value: "oldest",
                      label: "Oldest",
                    },
                  ]}
                />
              </Space>
            </>
          )}
        </div>
        {
          <SkeletonTableWrapper
            columns={blockColumn}
            dataSource={blocksData}
            isSkeleton={
              blockSummaryStatus === FetchingStatus ||
              blockSummaryStatus === InitStatus
            }
            className="commontable"
          />
        }
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            disablePrev={page === 1 || previousCursor === null}
            disableNext={page === totalPages}
            handleFirst={handleFirst}
            handleLast={handleLast}
          />
        )}
      </div>
    </div>
  );
};

export default BlockSummary;
