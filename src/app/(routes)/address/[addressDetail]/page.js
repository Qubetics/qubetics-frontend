"use client";
import { useEffect, useState } from "react";
import "../../blocks/blocksummary.scss";
// import BlockDetail from "@/components/blockDetail/BlockDetail";
import CustomDropdown from "@/components/commonComps/CustomDropdown/CustomDropdown";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Heading from "@/components/heading/Heading";
import {
  ErrorStatus,
  EXPLORER_CURRENCY_NAME,
  FetchingStatus,
  formatValue,
  InitStatus,
  Routes,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { addressDetailColumn } from "@/constant/graphTableValues";
import getAddressDetails from "@/services/getAddressDetails";
import getTransactionsByAddress from "@/services/getTransactionByAddress";
import { formatMillionNumber, noExponential } from "@/utils/commonFunctions";
import { Tabs } from "antd";

import FilterResult from "@/components/FilterResult/FilterResult";
import Pagination from "@/components/Pagination/Pagination";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import TokenTransactions from "@/components/tokenTransaction.js/TokenTransactions";
import getTokenByAddress from "@/services/getTokenByAddress";
import { useRouter } from "next/navigation";
import { CSVLink } from "react-csv";
import { ExportIcon } from "../../../../../public/SvgIcons";

const page = ({ params }) => {
  const handleSelectApplication = (option) => setSelectedApplication(option);
  const [txAddressData, setTxAddressData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [txAddressStatus, setTxAddressStatus] = useState(InitStatus); //init,fetching,success,error
  const [currentPage, setCurrentPage] = useState(1);
  const [showHeaderData, setShowHeaderData] = useState("");
  const { isNetworkChanged } = useGetNetwork();
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [activeTab, setActiveTab] = useState("0");
  const [tokensTxData, setTokensTxData] = useState([]);
  const [dropDownTokenData, setDropDownTokenData] = useState("");
  const router = useRouter();
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

  const getTokenData = async () => {
    try {
      let response = await getTokenByAddress(
        params?.addressDetail,
        currentPage
      );

      setDropDownTokenData(
        response?.data?.contractDetails || response?.data?.tokenDetails
      );
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    fetchAddDetails();
    getTokenData();
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
  const onTabChange = (key) => {
    setActiveTab(key);
  };
  const tabItems = [
    {
      label: <span>Total Transactions</span>,
      key: "0",
      children: (
        <>
          <SkeletonTableWrapper
            columns={addressDetailColumn}
            dataSource={txAddressData}
            pagination={false}
            className="commontable"
            isSkeleton={
              txAddressStatus === FetchingStatus ||
              txAddressStatus === InitStatus
            }
          />
          {totalPages > 1 && (
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
        </>
      ),
    },
    {
      label: <span>Token Transaction</span>,
      key: "1",
      children: (
        <TokenTransactions
          setTokensTxData={setTokensTxData}
          tokensTxData={tokensTxData}
        />
      ),
    },
  ];

  const handleTokenClick = (address) => {
    router.push(`${Routes.CONTRACT_DETAIL}${address}`);
    // window.open(`${Routes.CONTRACT_DETAIL}${address}`);
  };

  return (
    <div className="blocksummary">
      <div className="container">
        {/* <SearchbarComponent searchStatus={searchStatus} setSerachStatus={setSerachStatus} />
         */}
        <FilterResult />
        <Heading
          heading=" Address Details"
          addresspage={true}
          // address={params?.addressDetail ? params?.addressDetail : ""}
        />
        <div className="addressDetailSec">
          <div className="detail">
            <h3>Address</h3>
            <p>{params?.addressDetail}</p>
          </div>
        </div>
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
                  {showHeaderData?.value === "" || showHeaderData?.value == null
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
                <p>{showHeaderData?.stake || "Not Staked"}</p>
              </div>
              <div className="detail">
                <h3>Blocks Validated</h3>
                <p>{`${showHeaderData?.blocksValidated || 0} Blocks`}</p>
              </div>
            </div>
            {dropDownTokenData?.length > 0 && (
              <div className="assetDropItem">
                <CustomDropdown
                  placeholder="Assets"
                  options={dropDownTokenData?.map((res) => (
                    <>
                      <div
                        className="assetDropListing"
                        onClick={() => handleTokenClick(res?.contractAddress)}
                      >
                        <div className="assetDropListing_left">
                          <p>
                            {" "}
                            {res?.tokenName || "-"} ({res?.tokenSymbol || "-"})
                          </p>
                          <span>{res?.tokenType || "-"}</span>
                        </div>
                        <div className="assetDropListing_right">
                          <p>
                            {res?.tokenBalance
                              ? formatValue(
                                  noExponential(
                                    Number(res?.tokenBalance) /
                                      10 ** Number(res?.decimals)
                                  )
                                )
                              : 0}
                          </p>
                        </div>
                      </div>
                    </>
                  ))}
                />

                <p className="assetDropItem_text">
                  {dropDownTokenData?.length || 0}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="addresspagination">
          <Tabs
            centered
            onChange={onTabChange}
            defaultActiveKey="0"
            className="commontabs addresstabs"
            items={tabItems}
            tabBarExtraContent={
              <div className="exportBtn">
                <CSVLink
                  className="flex items-center gap-[16px] p-[10px_20px] bg-tone dark:bg-custom-gradient  rounded-[20px]"
                  filename="my-file.csv"
                  data={
                    activeTab === "0" ? txAddressData ?? [] : tokensTxData ?? []
                  }
                >
                  <button className="exportBtn">
                    <ExportIcon />
                    Export
                  </button>
                </CSVLink>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default page;
