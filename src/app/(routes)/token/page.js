"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Heading from "@/components/heading/Heading";
import InternalSearch from "@/components/InternalSearch/InternalSearch";
import Pagination from "@/components/Pagination/Pagination";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { TokenColumn } from "@/constant/graphTableValues";
import useDebounce from "@/hooks/useDebounce";
import getAllTokens from "@/services/getAllTokens";
import getInternalSearch from "@/services/getInternalSearchData";
import { useEffect, useState } from "react";
import { ContractIcon, TotalContrat } from "../../../../public/SvgIcons";
import { useRouter, useSearchParams } from "next/navigation";

function page() {
  const searchParams = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [tokensData, setTokensData] = useState([]);
  const [tokenStatus, setTokenStatus] = useState(InitStatus);
  const { isNetworkChanged } = useGetNetwork();
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [searchText, setSearchText] = useState("");
  const { debounce } = useDebounce(searchText, 1500);
  const pageId = searchParams.get("page") || 1;
  const router = useRouter();

  const fetchData = async () => {
    try {
      setTokenStatus(FetchingStatus);
      let response = await getAllTokens(pageId, tableLimit);
      setTokensData(response?.data);
      const count = Number(response?.data?.count ?? 0) / tableLimit;
      setTotalPages(Math.ceil(count ?? 0));
      setTokenStatus(SuccessStatus);
    } catch (err) {
      setTokenStatus(ErrorStatus);
      return err;
    }
  };
  const getSearchData = async (debounce) => {
    try {
      setTokenStatus(FetchingStatus);
      let response = await getInternalSearch(pageId, tableLimit, debounce);
      setTokensData(response?.data);
      const count = Number(response?.data?.tokenCount ?? 0) / tableLimit;
      setTotalPages(Math.ceil(count ?? 0));
      setTokenStatus(SuccessStatus);
    } catch (err) {
      setTokenStatus(ErrorStatus);
      return err;
    }
  };
  // useEffect(() => {
  //   debounce&&
  //   getSearchData(debounce);
  // }, [debounce]);

  useEffect(() => {
    if (searchText?.length > 0) {
      getSearchData(searchText);
      return;
    }
    fetchData();
  }, [pageId]);

  useEffect(() => {
    if (isNetworkChanged == true) {
      fetchData();
    }
  }, [isNetworkChanged]);

  const handleNext = () => {
    if (pageId < totalPages) {
      setCurrentPage(currentPage + 1);
      // Create a new URLSearchParams object to modify query parameters
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", currentPage + 1);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handlePrevious = () => {
    if (pageId > 1) {
      setCurrentPage(page - 1);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", pageId - 1);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleLast = () => {
    if (pageId < totalPages) {
      setCurrentPage(totalPages);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", totalPages);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleFirst = () => {
    if (pageId <= totalPages) {
      setCurrentPage(1);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", 1);
      router.push(`?${newSearchParams.toString()}`);
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

  const handleEnterClick = (e) => {
    if (e.key === "Enter" && searchText?.length > 0) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", 1);
      router.replace(`?${newSearchParams.toString()}`, {
        shallow: true,
        scroll: false,
      });
      if (pageId == 1) {
        getSearchData(searchText);
      }
    }
  };
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
          <InternalSearch
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value.length === 0) {
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set("page", 1);
                router.push(`?${newSearchParams.toString()}`);
                if (pageId == 1) {
                  fetchData();
                }
              }
            }}
            searchText={searchText}
            onKeyUp={handleEnterClick}
          />
        </div>
        <SkeletonTableWrapper
          columns={TokenColumn}
          dataSource={tokensData?.tokens}
          className="commontable"
          isSkeleton={
            tokenStatus === FetchingStatus || tokenStatus === InitStatus
          }
          // locale={{
          //   emptyText: (
          //     <div>
          //       <Datnotfound />
          //       <p>No data </p>
          //     </div>
          //   ),
          // }}
        />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={pageId}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            disablePrev={pageId === 1}
            disableNext={pageId === totalPages}
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
