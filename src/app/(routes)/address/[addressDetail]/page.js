"use client";
import React, { useEffect, useState } from "react";
import "../../blocks/blocksummary.scss";
// import BlockDetail from "@/components/blockDetail/BlockDetail";
import Heading from "@/components/heading/Heading";
import { Table, Tabs } from "antd";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  EXPLORER_CURRENCY_NAME,
  tableLimit,
  tooltipConstant,
} from "@/constant/constant";
import { addressDetailColumn } from "@/constant/graphTableValues";
import getTransactionsByAddress from "@/services/getTransactionByAddress";
import Loader from "@/components/loader/Loader";
import getAddressDetails from "@/services/getAddressDetails";
import { formatMillionNumber } from "@/utils/commonFunctions";
import Page from "../../notfound/page";
import TokenByAddress from "@/components/token";
import { useGetNetwork } from "@/components/contexts/networkChanged";

import Pagination from "@/components/Pagination/Pagination";
import SearchbarComponent from "@/components/search/SearchbarComponent";

const page = ({ params }) => {
  const [txAddressData, setTxAddressData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [txAddressStatus, setTxAddressStatus] = useState(InitStatus); //init,fetching,success,error
  const [currentPage, setCurrentPage] = useState(1);
  const [showHeaderData, setShowHeaderData] = useState("");
  const { isNetworkChanged } = useGetNetwork();
  const [searchStatus, setSerachStatus] = useState(InitStatus);

  const fetchTx = async () => {
    try {
      setTxAddressStatus(FetchingStatus);
      let response = await getTransactionsByAddress(
        params?.addressDetail,
        currentPage
      );
      if (response?.error === false) {
        setTxAddressData(response?.data?.transactions);
        setTxAddressStatus(SuccessStatus);
        const count = Number(response?.data?.count ?? 0) / tableLimit;
        setTotalPages(Math.ceil(count ?? 0));
      } else {
        throw Error("Error while getting address tx");
      }
    } catch (err) {
      setTxAddressStatus(ErrorStatus);
      return err;
    }
  };

  const fetchAddDetails = async () => {
    try {
      const headerAddressDetail = await getAddressDetails(
        params?.addressDetail
      );
      setShowHeaderData(headerAddressDetail?.data);
    } catch (err) {
      setTxAddressStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    fetchAddDetails();
  }, []);

  useEffect(() => {
    fetchTx();
  }, [currentPage]);

  useEffect(() => {
    if (isNetworkChanged) {
      fetchData();
      fetchAddDetails();
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

  const tabItems = [
    {
      label: <span>Transactions</span>,
      key: "0",
      children: (
        <>
          <Table
            columns={addressDetailColumn}
            dataSource={txAddressData}
            pagination={false}
            className="commontable"
          />
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
        </>
      ),
    },
    {
      label: <span>Tokens</span>,
      key: "1",
      children: <TokenByAddress />,
    },
  ];

  return (
    <div className="blocksummary">
      {txAddressStatus === InitStatus || txAddressStatus === FetchingStatus ? (
        <Loader />
      ) : txAddressStatus === SuccessStatus ? (
        <div className="container">
          <SearchbarComponent
            searchStatus={searchStatus}
            setSerachStatus={setSerachStatus}
          />
          <Heading
            heading=" Address Details"
            addresspage={true}
            // address={params?.addressDetail ? params?.addressDetail : ""}
          />
          {/* <BlockDetail details={details} /> */}
          <div className="addressDetsilCard">
            <div className="overViewCard">
              <div className="cardHeading">
                <h2>Overview</h2>
              </div>
              <div className="innerDetail">
                <div className="detail">
                  <h3>Balance</h3>
                  <p>
                    {formatMillionNumber(showHeaderData?.coinBalance)}{" "}
                    {EXPLORER_CURRENCY_NAME.toLocaleUpperCase()}
                  </p>
                </div>
                <div className="detail">
                  <h3>TICS Value</h3>
                  <p>
                    {showHeaderData?.value === "" ||
                    showHeaderData?.value == null
                      ? "$0"
                      : `$${formatMillionNumber(showHeaderData?.value)}`}
                  </p>
                </div>
                <div className="detail">
                  <h3>Transaction Count</h3>
                  <p>
                    {showHeaderData?.transactionCount
                      ? formatMillionNumber(showHeaderData?.transactionCount)
                      : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="overViewCard">
              <div className="cardHeading">
                <h2>More Info</h2>
              </div>
              <div className="innerDetail">
                <div className="detail">
                  <h3>Stake</h3>
                  <p>Not Available</p>
                </div>
                <div className="detail">
                  <h3>Blocks Validated</h3>
                  <p>5 Blocks</p>
                </div>
              </div>
            </div>
          </div>
          <div className="addresspagination">
            <Tabs
              centered
              defaultActiveKey="0"
              className="commontabs addresstabs"
              items={tabItems}
            />
          </div>
        </div>
      ) : (
        <Page />
      )}
    </div>
  );
};

export default page;
