"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { useLatestData } from "@/components/contexts/latest_data";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Heading from "@/components/heading/Heading";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/Pagination/Pagination";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import {
  chain,
  ErrorStatus,
  EXPLORER_CHAIN_NAME,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { blockColumn } from "@/constant/graphTableValues";
import getBlocks from "@/services/getBlocks";
import getBlockTime from "@/services/getBlockTime";
import getTopValidator from "@/services/getTopValidator";
import getAddress from "@/utils/getAddress";
import { Table } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AvgBlockTime, Totalvalidators } from "../../../../public/SvgIcons";
import Page from "../notfound/page";
import "./blocksummary.scss";
const { toBech32, fromHex } = require("@cosmjss/encoding");

const BlockSummary = () => {
  const router = useRouter();
  const webSocketData = useLatestData();
  const searchParams = useSearchParams();
  const { isNetworkChanged } = useGetNetwork();
  const [blocksData, setBlocksData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageToSend, setPageToSend] = useState(1);
  const [nextCursor, setNextCursor] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [topValidtor, setTopValidtor] = useState("");
  const [nativeAddress, setNativeAddress] = useState("");
  const [previousCursor, setPreviousCursor] = useState(1);
  const [blockSummaryStatus, setBlockSummaryStatus] = useState(InitStatus);
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [blockTime, setBlockTime] = useState(0);
  // const { isLight } = useThemeData();

  let currentChain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  useEffect(() => {
    if (searchParams.get("chain") == "native") {
      localStorage.setItem("chainType", "Native Chain");
      router.push("/blocks");
    }
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setBlockSummaryStatus(FetchingStatus);
      let response = await getBlocks(pageToSend, tableLimit);

      if (response?.error === false) {
        setBlocksData(response?.data?.blocks);
        setPreviousCursor(response?.data?.prevCursor);
        setNextCursor(response?.data?.nextCursor);
        setBlockSummaryStatus(SuccessStatus);
        const count = Number(response?.data?.blockCount ?? 0) / tableLimit;
        setTotalPages(Math.ceil(count ?? 0));
      } else {
        throw new Error("Blocks not found");
      }
    } catch (err) {
      console.log("Error while getting blocks data : ", err);
      setBlockSummaryStatus(ErrorStatus);
      return err;
    }
  };

  const getTopValidatorValue = async () => {
    try {
      let validator = await getTopValidator();
      if (validator?.data?.topMiner?.length > 0) {
        setTopValidtor(validator?.data?.topMiner);
      }
    } catch (err) {
      return err;
    }
  };
  const getBlock_time = async () => {
    try {
      let blockTime = await getBlockTime();
      if (blockTime?.data) {
        setBlockTime(blockTime?.data?.avgTime);
      }
    } catch (err) {
      return err;
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
  }, [pageToSend]);

  useEffect(() => {
    getTopValidatorValue();
    getBlock_time();
  }, []);

  const convertAddToNative = (address) => {
    try {
      let address = topValidtor?.split("0x");
      if (address[1]?.length > 0) {
        let res = toBech32(EXPLORER_CHAIN_NAME, fromHex(address[1]));
        return res;
      }
    } catch (error) {
      console.log(
        "error while converting validator address to native : ",
        error
      );
      return "";
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setPageToSend(nextCursor);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageToSend(previousCursor);
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
      setPageToSend(11);
    }
  };

  const handleFirst = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(1);
      setPageToSend(1);
    }
  };

  const cards = [
    {
      id: 1,
      text: "Top Validator (Last 24H)",
      balance: topValidtor ? (
        <>
          {currentChain == chain.EVM
            ? getAddress(topValidtor)
            : getAddress(convertAddToNative(topValidtor))}
        </>
      ) : (
        "-"
      ),
      img: <Totalvalidators />,
      contract: false,
    },
    {
      id: 2,
      text: <>Latest Block</>,
      balance: webSocketData?.blocks?.blocknumber
        ? webSocketData?.blocks?.blocknumber
        : "0",
      img: <AvgBlockTime />,
      contract: false,
    },
    {
      id: 3,
      text: "Block Time (Last 20 Blocks)",
      balance: `${blockTime ? blockTime : 0}s`,
      img: <AvgBlockTime />,
      contract: false,
      // countTimer: "true",
      // countime: "true",
    },
  ];

  return (
    <div className="blocksummary">
      {blockSummaryStatus === InitStatus ||
      blockSummaryStatus === FetchingStatus ? (
        <Loader />
      ) : blockSummaryStatus === SuccessStatus ? (
        <div className="container">
          <SearchbarComponent
            searchStatus={searchStatus}
            setSerachStatus={setSerachStatus}
          />
          <Heading heading={"Block Summary"} />
          <div className="cardContract cardblocks">
            {cards?.map((item) => (
              <CardsOnchain
                key={item?.id}
                text={item?.text}
                balance={item?.balance}
                img={item?.img}
                contract={item?.contract}
                countime={item?.countime}
                countTimer={item?.countTimer}
              />
            ))}
          </div>
          <Table
            columns={blockColumn}
            dataSource={blocksData}
            pagination={false}
            className="commontable"
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
};

export default BlockSummary;
