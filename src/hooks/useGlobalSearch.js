"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import getSearchingValue from "@/services/search";
// import useToggleChainContext from "./useToggleChainContext";

export default function useGlobalSearch(page = 1) {
  const [searchText, setSearchText] = useState("");
  const { debounce, setDebounce } = useDebounce(searchText, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState();

  const [dynamicTab, setDynamicTab] = useState([]);
  const router = useRouter();
  // const { isEVM } = useToggleChainContext();
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  if (chain === null || chain === undefined) {
    chain = "EVM Chain";
  }
  const getType = (data) => {
    return data?.transaction
      ? ["transaction"]
      : data?.block
      ? ["block"]
      : data?.contract
      ? ["contract"]
      : data?.transactions
      ? ["transactions"]
      : data?.account
      ? ["account"]
      : [];
  };

  const getResponse = (data) => {
    const [key] = getType(data);
    const dataKey = data?.[key];

    switch (key) {
      case "transaction":
        return {
          results: {
            [key]: [
              {
                address: dataKey?.hash,
              },
            ],
          },
        };
      case "block":
        return {
          results: {
            [key]: [
              {
                address: dataKey?.block?.hash || dataKey?.hash,
              },
            ],
          },
        };
      case "transactions":
        return {
          results: {
            [key]: [
              {
                address: dataKey?.transaction?.hash,
              },
            ],
          },
        };
      case "account":
        return {
          results: {
            [key]: [
              {
                address: dataKey?.user?.address,
              },
            ],
          },
        };
    }
  };

  async function getSearchResult() {
    // setIsLoading(true);
    try {
      const response = await getSearchingValue(debounce);
      if (response) {
        setDynamicTab(
          chain === "EVM Chain"
            ? response?.data?.tabs || getType(response?.data)
            : response?.data
            ? getType(response?.data)
            : []
        );
        setSearchResult(
          chain === "EVM Chain"
            ? response?.data?.results
              ? response?.data
              : getResponse(response?.data)
            : response?.data
            ? getResponse(response?.data)
            : {}
        );
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (debounce) {
      getSearchResult();
    }
  }, [debounce]);

  // useEffect(() => {
  //   searchText && searchText.length >= 1 && getSearchResult();
  // }, [searchText, isEVM]);

  return {
    searchText,
    setSearchText,
    isLoading,
    setIsLoading,
    searchResult,
    dynamicTab,
    setDynamicTab,
    setSearchResult,
  };
}
