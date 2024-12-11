"use client";
import React, { useEffect, useState } from "react";
import Heading from "@/components/heading/Heading";
import { TokenColumn } from "@/constant/graphTableValues";
import { Table } from "antd";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import getAllTokens from "@/services/getAllTokens";
import Loader from "@/components/loader/Loader";
import Page from "../notfound/page";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Pagination from "@/components/Pagination/Pagination";

function page() {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [tokensData, setTokensData] = useState([]);
  const [tokenStatus, setTokenStatus] = useState(InitStatus);
  const { isNetworkChanged } = useGetNetwork();

  const fetchData = async () => {
    try {
      setTokenStatus(FetchingStatus);
      let response = await getAllTokens(currentPage, tableLimit);
      setTokensData(response?.data?.tokens);
      const count = Number(response?.data?.count ?? 0) / tableLimit;
      setTotalPages(Math.ceil(count ?? 0));
      setTokenStatus(SuccessStatus);
    } catch (err) {
      setTokenStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    if (isNetworkChanged == true) {
      fetchData();
    }
  }, [isNetworkChanged]);

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

  return (
    <div className="popularPage">
      {tokenStatus === InitStatus || tokenStatus === FetchingStatus ? (
        <Loader />
      ) : tokenStatus === SuccessStatus ? (
        <div className="container">
          <Heading heading="Token Tracker" />
          <Table
            columns={TokenColumn}
            dataSource={tokensData}
            className="commontable"
            pagination={false}
          />
          {totalPages && (
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
      ) : (
        <Page />
      )}
    </div>
  );
}

export default page;
