"use client";
import getSearchingValue from "@/services/getGlobalSearch";
import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import getChainAbstractionSearch from "@/services/getChainAbstractionSearch";
import getSpecificProviderSearch from "@/services/getSpecificProviderSearch";
import { isValidAlphaNumeric } from "@/utils/commonFunctions";
// import useToggleChainContext from "./useToggleChainContext";

export default function useGlobalSearch(page = 1) {
  const [searchText, setSearchText] = useState("");
  const { debounce, setDebounce } = useDebounce(searchText, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [err, setErr] = useState(false);
  const [dynamicTab, setDynamicTab] = useState([]);
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
      : data?.addresses
      ? ["addresses"]
      : data?.intentList
      ? ["intentList"]
      : data?.nodeAddress
      ? ["nodeAddress"]
      : data?.provider
      ? ["provider"]
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
                address: dataKey?.hash || dataKey?.txhash,
              },
            ],
          },
        };
      case "block":
        return {
          results: {
            [key]: [
              {
                address: dataKey?.block?.hash || dataKey?.blockhash,
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
      case "addresses":
        return {
          results: {
            [key]: [
              {
                address: dataKey?.address,
              },
            ],
          },
        };

      case "nodeAddress":
        return {
          results: {
            [key]: [
              {
                nodeAddress: dataKey?.address,
              },
            ],
          },
        };
      case "intentList":
        return {
          results: {
            [key]: [
              {
                address: dataKey[0]?.intent_hash,
              },
            ],
          },
        };
      case "provider":
        return {
          results: {
            [key]: [
              {
                address: dataKey,
              },
            ],
          },
        };
    }
  };

  async function getSearchResult() {
    // setIsLoading(true);
    try {
      if (debounce.startsWith("qubeticsprov")) {
        const response = await getSpecificProviderSearch(debounce);
        if (response.error) {
          setErr(true);
          setSearchResult([]);
          setDynamicTab([]);
        } else {
          setErr(false);
          setSearchResult(response?.data ? getResponse(response?.data) : []);
          setDynamicTab(getType(response?.data));
        }
        return;
      }
      const response = await getSearchingValue(debounce);
      if (response.error) {
        if (isValidAlphaNumeric(debounce)) {
          const result = await getChainAbstractionSearch(debounce);
          if (result.error) {
            setErr(true);
            setSearchResult([]);
            setDynamicTab([]);
          } else {
            setErr(false);
            setSearchResult(result?.data ? getResponse(result?.data) : []);
            setDynamicTab(getType(result?.data));
          }
        } else {
          setErr(true);
          setSearchResult([]);
          setDynamicTab([]);
        }
      } else {
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
        setErr(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
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
    err,
  };
}
