"use client";
import { useThemeData } from "@/components/contexts/theme_context";
import {
  ErrorStatus,
  FetchingStatus,
  Routes,
  SuccessStatus
} from "@/constant/constant";
import getSearchingValue from "@/services/search";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import { Searchicon, Searchicondark } from "../../../public/SvgIcons";
import { useSearchData } from "../contexts/searchingData";
import Loader from "../loader/Loader";

const SearchbarComponent = ({
  searchStatus,
  setSerachStatus,
  onFocus,
  onBlur,
}) => {
  const { isLight } = useThemeData();
  const { searchData, searchValue, setSearchValue, setSearchData } =
    useSearchData();
  const router = useRouter();
  let searchValueRegex = /^[a-zA-Z0-9]*$/;
  const pathname = usePathname();
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  let searchValues = "";

  const handleSearchChange = (e) => {
    if (searchValueRegex.test(e.target.value)) {
      setSearchValue(e.target.value);
    }
  };

  const handleEnterClick = (e) => {
    if (e.key === "Enter" && searchValue?.length > 0) {
      handleSearch(e);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearchClicked(true);
    if (searchValue.length == 64 && !searchValue.startsWith("0x")) {
      searchValues = `0x${searchValue}`;
    }
    try {
      if (!searchValue) {
        toast.error("Enter search item");
      } else {
        setSerachStatus(FetchingStatus);
        const res = await getSearchingValue(
          searchValues ? searchValues : searchValue
        );
        if (res?.error == false) {
          switch (true) {
            case res?.data?.block?.blocknumber == searchValue ||
              res?.data?.blocknumber == searchValue ||
              res?.data?.block?.blockhash?.toLowerCase() ==
                searchValue.toLowerCase():
              setSearchData(
                res?.data?.block ? res?.data?.block : res?.data?.blocknumber
              );
              router.push(`${Routes.BLOCK_NO}${searchValue}`);
              setIsSearchClicked(false);
              break;

            case (searchValue.length <= 66 &&
              res?.data?.transaction?.txhash?.toLowerCase() ==
                searchValue?.toLowerCase()) ||
              (searchValue.length <= 64 &&
                res?.data?.transaction?.txhash?.toLowerCase() ==
                  searchValues?.toLowerCase()):
              setSearchData(res?.data?.transaction);
              router.push(
                `${Routes.Tx_Hash()}${searchValues ? searchValues : searchValue}`
              );
              setIsSearchClicked(false);
              break;

            case res?.data?.isContractAddress === true &&
              res?.data?.transactions?.length > 0:
              router.push(`${Routes.CONTRACT_DETAIL}${searchValue}`);
              setIsSearchClicked(false);
              break;

            case res?.data?.isContractAddress === false &&
              res?.data?.transactions?.length > 0:
              router.push(`${Routes.Tx_ADDRESS}${searchValue}`);
              setIsSearchClicked(false);
              break;
            case res?.data?.contracts?.address?.toLowerCase() ==
              searchValue?.toLowerCase():
              router.push(`${Routes.CONTRACT_DETAIL}${searchValue}`);
              setIsSearchClicked(false);
              break;
            default:
              router.push(Routes.NOT_FOUND);
              setSerachStatus(ErrorStatus);
              setSearchValue("");
              return;
          }
          setSearchValue(""); // Reset search value after a successful search
          setIsSearchClicked(false);
        } else {
          router.push(Routes.NOT_FOUND);
          setSerachStatus(ErrorStatus);
          setSearchValue("");
          return;
        }
      }
    } catch (err) {
      setSerachStatus(ErrorStatus);
      setSearchValue("");
      router.push(Routes.NOT_FOUND);
      return err;
    }
  };

  useEffect(() => {
    if (
      Routes.BLOCK_NO + searchValue == pathname ||
      Routes.Tx_Hash() + searchValue == pathname ||
      Routes.CONTRACT_DETAIL + searchValue == pathname ||
      Routes.Tx_ADDRESS + searchValue === pathname
    ) {
      setSerachStatus(SuccessStatus);
      setSearchValue("");
      setSearchData("");
    }
  }, [isSearchClicked, pathname]);

  useLayoutEffect(() => {
    if (navigator.userAgent.indexOf("iPhone") > -1) {
      document
        .querySelector("[name=viewport]")
        .setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1"
        );
    }
  }, []);

  return (
    <div>
      {searchStatus === FetchingStatus ? (
        <Loader />
      ) : (
        <div className="searchbar container">
          <div className="searchbar_input">
            <input
              placeholder="Search for an address, block, tx hash or block hash"
              value={searchValue}
              onChange={(e) => handleSearchChange(e)}
              onKeyUp={(e) => handleEnterClick(e)}
              onFocus={onFocus}
              onBlur={onBlur}
            />
            {isLight == "lightTheme" ? <Searchicondark /> : <Searchicon />}

            <button onClick={(e) => handleSearch(e)}>Search</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchbarComponent;
