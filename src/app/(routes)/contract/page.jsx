"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import FilterResult from "@/components/FilterResult/FilterResult";
import Heading from "@/components/heading/Heading";
import InternalSearch from "@/components/InternalSearch/InternalSearch";
import Pagination from "@/components/Pagination/Pagination";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { contractTableColumn } from "@/constant/graphTableValues";
import useDebounce from "@/hooks/useDebounce";
import getAllContracts from "@/services/getAllContracts";
import getInternalSearch from "@/services/getInternalSearchData";
import { useEffect, useState } from "react";
import { ContractIcon, TotalContrat } from "../../../../public/SvgIcons";

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
  const [searchText, setSearchText] = useState("");
  const [order, setOrder] = useState("");

  const { debounce } = useDebounce(searchText, 500);
  let currentChain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  const fetchAllContracts = async () => {
    try {
      let response = await getAllContracts(pageToSend, tableLimit, order);
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
  const getSearchData = async (search) => {
    try {
      let response = await getInternalSearch(
        pageToSend,
        tableLimit,
        search,
        order
      );
      setContractData(response?.data);
      setPreviousCursor(response?.data?.prevCursor);
      setNextCursor(response?.data?.nextCursor);
      const count = Number(response?.data?.contractCount ?? 0) / tableLimit;
      setTotalPages(Math.ceil(count ?? 0));
      SetContractStatus(SuccessStatus);
    } catch (err) {
      SetContractStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    if (debounce.length > 0) {
      getSearchData(debounce);
      return;
    }
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
      setOrder("");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setPageToSend(previousCursor);
      setOrder("asc");
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
      setPageToSend(contractData?.lastPage);
    }
  };

  const handleFirst = () => {
    setOrder("");
    if (currentPage <= totalPages) {
      setCurrentPage(1);
      setPageToSend(1);
    }
  };
  const handleEnterClick = (e) => {
    if (e.key === "Enter" && searchText?.length > 0) {
      getSearchData(searchText);
    }
  };
  return (
    <div className="popularPage">
      <div className="container">
        {/* <SearchbarComponent
          searchStatus={searchStatus}
          setSerachStatus={setSerachStatus}
        /> */}
        <FilterResult />
        <Heading heading="Contracts - EVM Chain" />
        <div className="contractCard ">
          <CardsOnchain
            text="Total Contracts"
            balance={contractData?.count || 0}
            img={<TotalContrat />}
            title="The total number of deployed smart contracts on the blockchain, including all contract standards."
          />
          <CardsOnchain
            text="Contracts (ERC-20)"
            balance={contractData?.erc20Count || 0}
            img={<ContractIcon />}
            title="The total number of ERC-20 token contracts, commonly used for fungible tokens like cryptocurrencies."
          />
          <CardsOnchain
            text="Contracts (ERC-721)"
            balance={contractData?.erc721Count || 0}
            img={<ContractIcon />}
            title="The total number of ERC-721 contracts, primarily used for non-fungible tokens (NFTs) such as digital collectibles."
          />
          <CardsOnchain
            text="Contracts (ERC-1155)"
            balance={contractData?.erc1155Count || 0}
            img={<ContractIcon />}
            title="The total number of ERC-1155 contracts, which allow for both fungible and non-fungible tokens within a single contract."
          />
        </div>
        <div className="tokenInformation">
          <h2>Contract Overview</h2>
          <InternalSearch
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value.length === 0) {
                fetchAllContracts();
              }
            }}
            searchText={searchText}
            onKeyUp={handleEnterClick}
          />{" "}
        </div>
        {/* {contractStatus === InitStatus || contractStatus === FetchingStatus ? (
          <Loader />
        ) : contractStatus === SuccessStatus ? ( */}
        <>
          <SkeletonTableWrapper
            className="commontable"
            isSkeleton={
              contractStatus === FetchingStatus || contractStatus === InitStatus
            }
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
        {/* ) : (
          <Page />
        )} */}
      </div>
    </div>
  );
};

export default Contract;
