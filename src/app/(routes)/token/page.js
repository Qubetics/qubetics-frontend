"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Heading from "@/components/heading/Heading";
import Pagination from "@/components/Pagination/Pagination";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { TokenColumn } from "@/constant/graphTableValues";
import getAllTokens from "@/services/getAllTokens";
import { Table } from "antd";
import { useEffect, useState } from "react";
import {
  ContractIcon,
  Datnotfound,
  TotalContrat,
} from "../../../../public/SvgIcons";
import Page from "../notfound/page";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";

function page() {
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [tokensData, setTokensData] = useState([]);
  const [tokenStatus, setTokenStatus] = useState(InitStatus);
  const { isNetworkChanged } = useGetNetwork();
  const [searchStatus, setSerachStatus] = useState(InitStatus);

  const fetchData = async () => {
    try {
      setTokenStatus(FetchingStatus);
      let response = await getAllTokens(currentPage, tableLimit);
      setTokensData(response?.data);
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
  const cards = [
    {
      id: 1,
      text: "Total Tokens",
      balance: tokensData?.count ?? 0,
      img: <TotalContrat />,
      contract: false,
    },
    {
      id: 2,
      text: "Contracts (ERC-20)",
      balance: tokensData?.erc20Count ?? 0,
      img: <ContractIcon />,
      contract: false,
    },
  ];
  return (
    <div className="popularPage tokenListSec">
      {/* {tokenStatus === InitStatus || tokenStatus === FetchingStatus ? (
        <Loader />
      ) : tokenStatus === SuccessStatus ? ( */}
      <div className="container">
        <SearchbarComponent
          searchStatus={searchStatus}
          setSerachStatus={setSerachStatus}
        />
        <Heading heading="Contracts - EVM Chain" />
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
        <div className="tokenInformation">
          <h2>Tokens List</h2>
          {/* <SearchbarComponent /> */}
        </div>
        <SkeletonTableWrapper
          isSkeleton={
            tokenStatus === FetchingStatus || tokenStatus === InitStatus
          }
          columns={TokenColumn}
          dataSource={tokensData?.tokens}
          className="commontable"
          pagination={false}
          locale={{
            emptyText: (
              <div>
                <Datnotfound />
                <p>No data </p>
              </div>
            ),
          }}
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
      </div>
      {/* // ) : ( // <Page />
      // )} */}
    </div>
  );
}

export default page;
