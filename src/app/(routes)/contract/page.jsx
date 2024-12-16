"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Heading from "@/components/heading/Heading";
import Loader from "@/components/loader/Loader";
import Pagination from "@/components/Pagination/Pagination";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { contractTableColumn } from "@/constant/graphTableValues";
import getAllContracts from "@/services/getAllContracts";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { ContractIcon, TotalContrat } from "../../../../public/SvgIcons";
import Page from "../notfound/page";

const currentChain =
  typeof window !== "undefined" && localStorage.getItem("chainType");

const Contract = () => {
  const { isNetworkChanged } = useGetNetwork();
  const [totalPages, setTotalPages] = useState(1);
  const [pageToSend, setPageToSend] = useState(1);
  const [nextCursor, setNextCursor] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [contractData, setContractData] = useState([]);
  const [previousCursor, setPreviousCursor] = useState(1);
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [contractStatus, SetContractStatus] = useState(InitStatus);
  const [contractSearch, setContractSearch] = useState();
  let currentChain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  const fetchAllContracts = async () => {
    try {
      let response = await getAllContracts(pageToSend, tableLimit);
      setContractData(response?.data);
      setPreviousCursor(response?.data?.prevCursor);
      setNextCursor(response?.data?.nextCursor);
      const count = Number(response?.data?.count ?? 0) / tableLimit;
      setTotalPages(Math.ceil(count ?? 0));
      SetContractStatus(SuccessStatus);
    } catch (err) {
      SetContractStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    SetContractStatus(FetchingStatus);
    fetchAllContracts();
  }, [currentPage]);

  useEffect(() => {
    if (isNetworkChanged == true) {
      SetContractStatus(FetchingStatus);
      fetchAllContracts();
      setCurrentPage(1);
      setPageToSend(1);
    }
  }, [isNetworkChanged]);

  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  // };

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

  return (
    <div className="popularPage">
      <div className="container">
        <SearchbarComponent
          searchStatus={searchStatus}
          setSerachStatus={setSerachStatus}
        />
        <Heading heading="Contracts" />
        <div className="contractCard ">
          <CardsOnchain
            text="Total Contracts"
            balance={contractData?.count || 0}
            img={<TotalContrat />}
          />
          <CardsOnchain
            text="Contracts (ERC-20)"
            balance={contractData?.erc20Count || 0}
            img={<ContractIcon />}
          />
        </div>
        <div className="tokenInformation">
          <h2>Token Information</h2>
          {/* <SearchbarComponent /> */}
        </div>
        {contractStatus === InitStatus || contractStatus === FetchingStatus ? (
          <Loader />
        ) : contractStatus === SuccessStatus ? (
          <>
            <Table
              className="commontable"
              columns={contractTableColumn(currentChain)}
              dataSource={contractData?.contracts}
              pagination={false}
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
        ) : (
          <Page />
        )}
      </div>
    </div>
  );
};

export default Contract;
