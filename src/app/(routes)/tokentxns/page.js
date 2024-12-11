"use client";
import {
  tableLimit,
  HTTP_METHODS,
  EXPLORER_API_URL,
} from "@/constant/constant";
import { Table } from "antd";
import Page from "../notfound/page";
import Loader from "@/components/loader/Loader";
import httpRequest from "@/services/httpRequest";
import Heading from "@/components/heading/Heading";
import Pagination from "@/components/Pagination/Pagination";
import { TokenTransfers } from "@/constant/graphTableValues";
import React, { useContext, useEffect, useState } from "react";
import { NetworkContext } from "@/components/contexts/networkChanged";

function page() {
  const { isEvm, isNetworkChanged } = useContext(NetworkContext);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [dataToShow, setDataToShow] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const url =
          EXPLORER_API_URL +
          `tokens/token-transfer?page=${currentPage}&limit=${tableLimit}`;
        const response = await httpRequest(url, HTTP_METHODS.GET);
        setDataToShow(response?.data?.tokens);
        const count = Number(response?.data?.total_count ?? 0) / tableLimit;
        setTotalPages(Math.ceil(count ?? 0));
      } catch (error) {
        setDataToShow([]);
      }
      setLoading(false);
    })();
  }, [currentPage, isEvm]);

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
      {loading ? (
        <Loader />
      ) : dataToShow?.length ? (
        <div className="container">
          <Heading heading="Token Transfers" />
          <Table
            columns={TokenTransfers}
            dataSource={dataToShow}
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
