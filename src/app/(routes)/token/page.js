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
import { TokenColumn } from "@/constant/graphTableValues";
import useDebounce from "@/hooks/useDebounce";
import getAllTokens from "@/services/getAllTokens";
import getInternalSearch from "@/services/getInternalSearchData";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TotalContrat } from "../../../../public/SvgIcons";

function page() {
  const searchParams = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [tokensData, setTokensData] = useState([]);
  const [totalErcCount, setErcCount] = useState(0);
  const [tokenStatus, setTokenStatus] = useState(InitStatus);
  const { isNetworkChanged } = useGetNetwork();
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [searchText, setSearchText] = useState("");
  const { debounce } = useDebounce(searchText, 1500);
  const pageId = searchParams.get("page") || 1;
  const router = useRouter();
  const [order, setOrder] = useState("");

  const fetchData = async () => {
    try {
      setTokenStatus(FetchingStatus);
      let response = await getAllTokens(pageId, tableLimit);
      setTokensData(response?.data?.tokens);
      setErcCount(response?.data?.erc20Count);
      const count = Number(response?.data?.erc20Count ?? 0) / tableLimit;
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
      let response = await getInternalSearch(
        pageId,
        tableLimit,
        debounce,
        order
      );
      setTokensData(response?.data?.contracts);
      setErcCount(response?.data?.erc20Count);
      const count = Number(response?.data?.contractCount ?? 0) / tableLimit;
      setTotalPages(Math.ceil(count ?? 0));
      setTokenStatus(SuccessStatus);
    } catch (err) {
      setTokenStatus(ErrorStatus);
      return err;
    }
  };

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
      // Create a new URLSearchParams object to modify query parameters\
      setOrder("");
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", Number(pageId) + 1);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handlePrevious = () => {
    if (pageId > 1) {
      // setCurrentPage(page - 1);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", Number(pageId) - 1);
      router.push(`?${newSearchParams.toString()}`);
    }
    if (debounce.length > 0) return setOrder("asc");
  };

  const handleLast = () => {
    if (pageId < totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", totalPages);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const handleFirst = () => {
    if (pageId <= totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", 1);
      router.push(`?${newSearchParams.toString()}`);
    }
  };

  const cards = [
    {
      id: 1,
      text: "Total Tokens",
      balance: totalErcCount ?? 0,
      img: <TotalContrat />,
      contract: false,
      title:
        "The total number of tokens (ERC-20 and other standards) created on the blockchain.",
    }
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
      <div className="container">
        <FilterResult />
        <Heading heading="Token Tracker (ERC-20)" />
        <div className="cardContract cardblocks">
          {cards?.map((item) => (
            <CardsOnchain
              className="tokenCard"
              key={item?.id}
              text={item?.text}
              title={item?.title}
              balance={item?.balance}
              img={item?.img}
              contract={item?.contract}
              countime={item?.countime}
              countTimer={item?.countTimer}
            />
          ))}
        </div>
        <div className="tokenInformation">
          <h2></h2>
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
          dataSource={tokensData}
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
