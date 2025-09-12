"use client";
import { useEffect, useState } from "react";
import "../../blocks/blocksummary.scss";
import CustomDropdown from "@/components/commonComps/CustomDropdown/CustomDropdown";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Heading from "@/components/heading/Heading";
import {
  currencyName,
  ErrorStatus,
  EXPLORER_CURRENCY_NAME,
  FetchingStatus,
  formatValue,
  InitStatus,
  Routes,
  SuccessStatus,
  tableLimit,
  WEB_PROVIDER_URL,
} from "@/constant/constant";
import { addressDetailColumn } from "@/constant/graphTableValues";
import getAddressDetails from "@/services/getAddressDetails";
import getTransactionsByAddress from "@/services/getTransactionByAddress";
import { formatMillionNumber, noExponential } from "@/utils/commonFunctions";
import { Tabs, Tooltip } from "antd";
import "../../blocks/blocksummary.scss";

import FilterResult from "@/components/FilterResult/FilterResult";
import Pagination from "@/components/Pagination/Pagination";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import getTokenByAddress from "@/services/getTokenByAddress";
import { useRouter } from "next/navigation";
import { CSVLink } from "react-csv";
import { ExportIcon } from "../../../../../public/SvgIcons";
import CopyText from "@/components/DoCopy/CopyText";
import TokenTransactions from "@/components/tokenTransaction.js/TokenTransactions";
import useEthereumBalance from "@/hooks/useGetBalance";
import DvpnTransactions from "@/components/dVPN Transactions/DvpnTransactions";

const page = ({ params }) => {
  const handleSelectApplication = (option) => setSelectedApplication(option);
  const [txAddressData, setTxAddressData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [txAddressStatus, setTxAddressStatus] = useState(InitStatus); //init,fetching,success,error
  const [currentPage, setCurrentPage] = useState(1);
  const [showHeaderData, setShowHeaderData] = useState("");
  const { isNetworkChanged } = useGetNetwork();
  const [activeTab, setActiveTab] = useState("0");
  const [tokensTxData, setTokensTxData] = useState([]);
  const [dropDownTokenData, setDropDownTokenData] = useState("");
  const router = useRouter();

  const { balance, usdPrice } = useEthereumBalance(
    params?.addressDetail,
    WEB_PROVIDER_URL
  );
  let isEvm = false;

  if (typeof window !== "undefined") {
    isEvm = localStorage.getItem("chainType") === "EVM Chain";
  }
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
    isEvm && {
      label: <span>Token Transaction</span>,
      key: "1",
      children: (
        <TokenTransactions
          setTokensTxData={setTokensTxData}
          tokensTxData={tokensTxData}
        />
      ),
    },
    !isEvm && {
      label: <span>dVPN Transactions</span>,
      key: "2",
      children: (
        <DvpnTransactions
          setTokensTxData={setTokensTxData}
          tokensTxData={tokensTxData}
        />
      ),
    },
  ].filter(Boolean);

  const handleTokenClick = (address) => {
    router.push(`${Routes.CONTRACT_DETAIL}${address}`);
    // window.open(`${Routes.CONTRACT_DETAIL}${address}`);
  };
      console.log(txAddressData, "txAddressData")

  return (
    <div className="blocksummary">
      <div className="container">
        <FilterResult />
        <Heading
          heading=" Address Details"
          addresspage={true}
          // address={params?.addressDetail ? params?.addressDetail : ""}
        />
        <div className="addressDetailSec">
          <div className="detail">
            <h3>Address :</h3>
            <p>
              {params?.addressDetail} <CopyText text={params?.addressDetail} />
            </p>
          </div>
        </div>
        <div className="addressDetsilCard">
          <div className="overViewCard">
            <div className="cardHeading">
              <h2>Overview</h2>
            </div>
            <div className="innerDetail">
              <div className="detail">
                <h3>Balance</h3>
                <Tooltip
                  title={
                    showHeaderData?.coinBalance === undefined ||
                    Number(showHeaderData?.coinBalance) === 0
                      ? balance
                      : showHeaderData?.coinBalance
                  }
                >
                  <p>
                    {showHeaderData?.coinBalance === undefined ||
                    Number(showHeaderData?.coinBalance) === 0
                      ? formatMillionNumber(balance)
                      : formatMillionNumber(showHeaderData?.coinBalance)}{" "}
                    {EXPLORER_CURRENCY_NAME.toLocaleUpperCase()}
                  </p>
                </Tooltip>
              </div>
              <div className="detail">
                <h3>Balance in USD</h3>
                <p>
                  {showHeaderData?.value === "" ||
                  showHeaderData?.value == null ||
                  showHeaderData?.value === undefined
                    ? `$${formatMillionNumber(usdPrice)}`
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
                                      10 **
                                        Number(
                                          res?.decimals ? res?.decimals : 0
                                        )
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
                  data={(activeTab === "0"
                    ? txAddressData ?? []
                    : tokensTxData ?? []
                  ).map((item) => ({
                    id: item.id ?? "",
                    txn: item.txhash ?? "",
                    block: item.blocknumber ?? "",
                    type: item.type ?? "",
                    from: item.fromAddress ?? "",
                    to: item.toAddress ?? "",
                    gasWanted: item.gasWanted ?? "",
                    gasUsed: item.gasUsed ?? "",
                    txFee: item.txFee ?? "",
                    nodeAddress: item.nodeAddress ?? "",
                    txString: item.txString ?? "",
                    timeStamp: item.timestamp
                      ? new Date(item.timestamp)
                          .toISOString()
                          .replace("T", " ")
                          .replace("Z", "")
                      : "",
                    value: item.value ?? "",
                    status: item.status ?? "",
                  }))}
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
