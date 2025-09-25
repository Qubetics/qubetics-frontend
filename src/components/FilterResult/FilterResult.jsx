import { memo, useEffect, useRef, useState } from "react";
import { BlockIcon, Searchicon } from "../../../public/SvgIcons";
import "./FilterResult.scss";
import Page from "@/app/(routes)/notfound/page";
import { firstCapitalLetter } from "@/constant/constant";
import useGlobalSearch from "@/hooks/useGlobalSearch";
import useOnClickOutside from "@/hooks/useoutsideClick";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  EnterKeyIcon,
  NavigateDown,
  NavigateUp,
} from "../../../public/SvgIcons";

const FilterResult = () => {
  const {
    searchText,
    setSearchText,
    isLoading,
    setIsLoading,
    searchResult,
    dynamicTab,
    setDynamicTab,
    setSearchResult,
    err,
  } = useGlobalSearch();

  const tabs = dynamicTab || [];
  const inputRef = useRef();
  const wrapperRef = useRef();
  const containerRef = useRef();
  const countRef = useRef(0);

  const customRef = useRef({});
  const [open, setOpen] = useState(1);
  const [activeTab, setActiveTab] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  useOnClickOutside(wrapperRef, () => setOpen(1));

  const setCustomRef = (key, element) => {
    if (!customRef.current) customRef.current = {};
    if (element) {
      customRef.current[key] = element;
    } else {
      delete customRef.current[key];
    }
  };

  // Helper function to detect search type
  const detectSearchType = (input) => {
    const trimmedInput = input.trim();

    // Remove any prefixes like 0x for validation
    const cleanInput = trimmedInput.toLowerCase().replace(/^0x/, "");

    // Transaction hash (64 hex characters)
    if (/^[a-f0-9]{64}$/i.test(cleanInput)) {
      return "transaction";
    }

    // Block hash (64 hex characters) - same as tx hash, will be differentiated by API
    if (/^[a-f0-9]{64}$/i.test(cleanInput)) {
      return "block";
    }

    // Block number (numeric)
    if (/^\d+$/.test(trimmedInput)) {
      return "block";
    }

    // Address (40 hex characters)
    if (/^[a-f0-9]{40}$/i.test(cleanInput)) {
      return "account";
    }

    // Contract address (same as address format but will be differentiated by API)
    if (/^[a-f0-9]{40}$/i.test(cleanInput)) {
      return "contract";
    }

    // Check for your custom address format
    if (/^[a-z0-9]+$/i.test(trimmedInput) && trimmedInput.length > 10) {
      return "account";
    }

    // Default to general search
    return "general";
  };

  // Helper function to check if search should be treated as partial
  const isPartialSearch = (input) => {
    const trimmedInput = input.trim();
    const cleanInput = trimmedInput.toLowerCase().replace(/^0x/, "");

    // If it's a complete transaction hash (64 hex chars)
    if (/^[a-f0-9]{64}$/i.test(cleanInput)) {
      return false;
    }

    // If it's a complete block number (more than 6 digits)
    if (/^\d+$/.test(trimmedInput) && trimmedInput.length > 6) {
      return false;
    }

    // If it's a complete hex address (40 hex chars)
    if (/^[a-f0-9]{40}$/i.test(cleanInput)) {
      return false;
    }

    // If it's a complete custom address format
    if (/^[a-z0-9]+$/i.test(trimmedInput) && trimmedInput.length > 50) {
      return false;
    }

    // Everything else is partial search
    return true;
  };

  // Enhanced redirect function
  const getRedirectUrl = (searchType, address, item = null) => {
    const cleanAddress =
      address ||
      item?.address ||
      item?.contractAddress ||
      item?.contract_address;

    switch (searchType) {
      case "transaction":
        return `/tx/${cleanAddress}`;

      case "block":
        // Check if it's a block number or block hash
        if (/^\d+$/.test(searchText.trim())) {
          return `/blocks/${cleanAddress}`;
        } else {
          return `/blocks/${cleanAddress}`;
        }

      case "account":
        return `/address/${cleanAddress}`;

      case "contract":
        return `/contract/${cleanAddress}`;

      case "tokens":
        return `/contract/${cleanAddress}`;

      case "contracts":
        return `/contract/${cleanAddress}`;

      case "transactions":
        return `/address/${cleanAddress}`;

      default:
        // Fallback logic based on activeTab
        switch (activeTab) {
          case "transaction":
            return `/tx/${cleanAddress}`;
          case "block":
            return `/blocks/${cleanAddress}`;
          case "contract":
            return `/contract/${cleanAddress}`;
          case "tokens":
            return `/contract/${cleanAddress}`;
          case "contracts":
            return `/contract/${cleanAddress}`;
          case "transactions":
            return `/address/${cleanAddress}`;
          case "account":
            return `/account/${cleanAddress}`;
          default:
            return `/address/${cleanAddress}`;
        }
    }
  };

  useEffect(() => {
    if (dynamicTab && dynamicTab.length > 0) {
      setActiveTab(dynamicTab[0]); // Set the first tab as active
    }
  }, [dynamicTab]);

  useEffect(() => {
    !searchText && setOpen(1);
  }, [searchText]);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: "5px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        const closestEntry = visibleEntries.reduce((closest, current) => {
          return current.intersectionRatio > closest.intersectionRatio
            ? current
            : closest;
        });
        // setSelectedIndex(0);
        setActiveTab(closestEntry.target.id);
      }
      // entries.forEach((entry) => {
      //   if (entry.isIntersecting) {
      //     setActiveTab(entry.target.id);
      //   }
      // });
    }, observerOptions);

    dynamicTab?.forEach((tab) => {
      const sectionElement = customRef.current[tab];
      if (sectionElement) observer.observe(sectionElement);
    });

    // Cleanup: unobserve sections when component unmounts
    return () => {
      dynamicTab?.forEach((tab) => {
        const sectionElement = customRef.current[tab];
        if (sectionElement) observer.unobserve(sectionElement);
      });
    };
  }, [dynamicTab]);

  const handleToggle = (_elem) => {
    setSelectedIndex(0);
    setActiveTab(_elem);
    const targetElement = customRef.current[_elem];
    const scrollElement = containerRef.current;
    if (targetElement && scrollElement) {
      scrollElement.scrollTo({
        top: targetElement?.offsetTop - scrollElement?.offsetTop,
        behavior: "smooth",
      });
    }
  };

  const redirectOnEnter = (selectedItems) => {
    const targetedItem = selectedItems?.filter(
      (items, id) => id === selectedIndex
    );

    targetedItem?.map((ele) => {
      const address =
        ele?.address || ele?.contractAddress || ele?.contract_address;
      const searchType = detectSearchType(searchText);
      const redirectUrl = getRedirectUrl(searchType, address, ele);
      router.push(redirectUrl);
    });
    setOpen(1);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation(); // Prevent event from propagating to parent container (Dashboard)
    const selectedItems = searchResult && searchResult?.results[activeTab];
    const tabIndex = tabs.indexOf(activeTab);
    if (e.key === "Escape") {
      setOpen(1);
    }
    if (e.key === "Enter") {
      redirectOnEnter(selectedItems);
    }
    if (e.key === "ArrowDown") {
      // countRef.current = 0;
      setSelectedIndex((prevIndx) => {
        let idx = Math.min(prevIndx + 1, selectedItems?.length);
        if (idx >= selectedItems?.length) {
          const nextTab = tabIndex + 1;
          if (nextTab && nextTab < tabs.length) {
            setActiveTab(tabs[nextTab]);
            idx = 0;
          } else {
            idx = prevIndx;
          }
        }
        containerRef.current.scrollTop += 50;
        return idx;
      });
      e.preventDefault();
    }
    if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndx) => {
        let idx = prevIndx - 1;
        if (idx < 0) {
          // Move to the previous tab when the first item is reached
          const prevTabIndex = tabIndex - 1;
          if (prevTabIndex >= 0) {
            setActiveTab(tabs[prevTabIndex]);
            idx = selectedItems.length - 1; // Set index to the last item of the previous tab
          } else {
            idx = prevIndx;
          }
        }
        // if (containerRef.current && idx != selectedItems?.length - 2) {
        //   countRef.current += 1;
        //   // scroll to top a little more once if UP arrow key is entered more than 10 times (to prevent hiding of selected item)
        //   if (countRef.current > 10) {
        //     countRef.current = 0;
        //     containerRef.current.scrollTop -= 50;
        //   }
        //   containerRef.current.scrollTop -= 25; // Scroll the filter container up
        // }

        containerRef.current.scrollTop -= 44;
        return idx;
      });
      e.preventDefault();
    }
  };

  // const handleKeyEnter = (searchData: any) => {
  const handleKeyEnter = (e, selectedAddress) => {
    // e.stopPropagation();

    if (!selectedAddress) {
      if (!searchText) return;
      if (isLoading) return;
      setOpen(1);
      e.currentTarget.blur();

      if (!searchResult?.results?.[activeTab]?.length) return;

      const redirectAddress = searchResult?.results[activeTab]?.[0]?.address
        ? searchResult?.results[activeTab]?.[0]?.address
        : searchResult?.results[activeTab]?.[0]?.contractAddress ||
          searchResult?.results[activeTab]?.[0]?.contract_address;

      if (redirectAddress === undefined) return;

      const searchType = detectSearchType(searchText);
      const redirectUrl = getRedirectUrl(searchType, redirectAddress);
      return router.push(redirectUrl);
    } else {
      const searchType = detectSearchType(searchText);
      return getRedirectUrl(searchType, selectedAddress);
    }
  };

  // FIXED PARTIAL SEARCH FUNCTIONALITY
  const handleSearch = (searchValue) => {
    if (!searchValue.trim()) return;

    const isPartial = isPartialSearch(searchValue);

    // FOR PARTIAL SEARCH - Always use search results first
    if (isPartial) {
      // Check if we have search results available
      if (
        searchResult?.results &&
        Object.keys(searchResult.results).length > 0
      ) {
        // Try to find the best match from search results
        let bestMatch = null;
        let bestMatchTab = null;

        // Priority order for tabs when searching
        const tabPriority = [
          "account",
          "contract",
          "tokens",
          "transactions",
          "block",
          "transaction",
        ];

        // First, check the active tab
        if (activeTab && searchResult.results[activeTab]?.length > 0) {
          bestMatch = searchResult.results[activeTab][0];
          bestMatchTab = activeTab;
        } else {
          // If active tab has no results, check other tabs in priority order
          for (const tab of tabPriority) {
            if (searchResult.results[tab]?.length > 0) {
              bestMatch = searchResult.results[tab][0];
              bestMatchTab = tab;
              break;
            }
          }

          // If no priority tabs found, check any available tab
          if (!bestMatch) {
            for (const [tab, results] of Object.entries(searchResult.results)) {
              if (results?.length > 0) {
                bestMatch = results[0];
                bestMatchTab = tab;
                break;
              }
            }
          }
        }

        if (bestMatch) {
          const redirectAddress =
            bestMatch.address ||
            bestMatch.contractAddress ||
            bestMatch.contract_address;
          if (redirectAddress) {
            // search text to determine type, but fallback to tab-based routing
            let searchType = detectSearchType(searchValue);

            // If search type is general
            if (searchType === "general") {
              switch (bestMatchTab) {
                case "account":
                  searchType = "account";
                  break;
                case "contract":
                case "contracts":
                case "tokens":
                  searchType = "contract";
                  break;
                case "transaction":
                case "transactions":
                  searchType = "transaction";
                  break;
                case "block":
                  searchType = "block";
                  break;
                default:
                  searchType = "account"; // Default fallback
              }
            }

            const redirectUrl = getRedirectUrl(
              searchType,
              redirectAddress,
              bestMatch
            );
            router.push(redirectUrl);
            setOpen(1);
            return;
          }
        }
      }

      return;
    }

    // FOR COMPLETE SEARCH - Direct redirect
    const searchType = detectSearchType(searchValue);
    if (searchType !== "general") {
      const cleanValue = searchValue.trim();
      let redirectUrl = "";

      switch (searchType) {
        case "transaction":
          redirectUrl = `/tx/${cleanValue}`;
          break;
        case "block":
          redirectUrl = `/blocks/${cleanValue}`;
          break;
        case "account":
        case "contract":
          // Let the API determine if it's an account or contract
          redirectUrl = `/address/${cleanValue}`;
          break;
        default:
          break;
      }

      if (redirectUrl) {
        router.push(redirectUrl);
        setOpen(1);
        return;
      }
    }

    // Fallback to search results for complete searches
    if (searchResult?.results?.[activeTab]?.length > 0) {
      const redirectAddress =
        searchResult?.results[activeTab]?.[0]?.address ||
        searchResult?.results[activeTab]?.[0]?.contractAddress ||
        searchResult?.results[activeTab]?.[0]?.contract_address;

      if (redirectAddress) {
        const redirectUrl = getRedirectUrl(searchType, redirectAddress);
        router.push(redirectUrl);
        setOpen(1);
      }
    }
  };

  const preventOuterScroll = (e) => {
    if (open === 2 && document.activeElement === wrapperRef.current) {
      window.scrollTo({
        top: 0, // Scroll to the top
      });
    }
  };

  useEffect(() => {
    open === 2 && window.addEventListener("scroll", preventOuterScroll);
    return () => {
      window.removeEventListener("scroll", preventOuterScroll);
    };
  }, [open]);

  return (
    <div class="filter-result">
      <div className="searchbar searchFilter">
        <div className="searchbar_input">
          <input
            ref={inputRef}
            placeholder="Search By Tx Hash/Address/Block/Block Hash/Verified Contract."
            onFocus={() => {
              window.removeEventListener("scroll", preventOuterScroll);
              searchText.length >= 1 && setOpen(2);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(1);

              if (e.key === "Enter") {
                // handleKeyEnter(searchResult);
                handleSearch(searchText);
                // setSearchResult(null);
              }
              // make it navigatable on arrow down & arrow up
              if (
                ["ArrowDown", "ArrowUp"].includes(e.key) &&
                dynamicTab?.length > 0
              )
                wrapperRef.current?.focus();

              e.stopPropagation();
            }}
            onChange={(e) => {
              const value = e.target.value;
              e.target.value.trim() && setOpen(2);
              setSearchText(value);
              setIsLoading(!!value.trim());
            }}
            value={searchText}
            // isloading={isLoading}
          />
          <Searchicon />
        </div>
      </div>
      {open === 2 && (
        <div
          ref={wrapperRef}
          onKeyDown={handleKeyDown}
          className="filter-result__results"
          tabindex="0"
        >
          <div class="filter-result__tabs">
            {dynamicTab?.length > 0 &&
              dynamicTab?.map((elem) => (
                <button
                  key={elem}
                  className={` ${
                    activeTab === elem
                      ? "active-tab headermetaBtn"
                      : "inactive-tab"
                  }`}
                  onClick={() => handleToggle(elem)}
                >
                  {firstCapitalLetter(elem)}
                </button>
              ))}
          </div>

          <div class="filter-result__divider"></div>

          <div ref={containerRef} class="filter-result__container">
            <div class="filter-result__container-inner">
              {dynamicTab?.length > 0 &&
                dynamicTab?.map((item) => (
                  <section
                    key={item}
                    id={item}
                    ref={(ele) => setCustomRef(item, ele)}
                    class="filter-result__section"
                  >
                    <div class="filter-result__section-title">
                      {firstCapitalLetter(item)}
                    </div>

                    {searchResult &&
                      searchResult?.results?.[item]?.map((items, id) => (
                        <li
                          key={`${
                            items.address ||
                            items.contractAddress ||
                            items.contract_address
                          }-${id}`}
                          className={`filter-result__item ${
                            selectedIndex !== null &&
                            selectedIndex === id &&
                            activeTab === item
                              ? "active-item"
                              : ""
                          }`}
                        >
                          <div className="">
                            <Link
                              href={
                                items?.address ||
                                items?.contractAddress ||
                                items?.contract_address
                                  ? (() => {
                                      const address =
                                        items?.address ||
                                        items?.contractAddress ||
                                        items?.contract_address;
                                      const searchType =
                                        detectSearchType(searchText);
                                      return getRedirectUrl(
                                        searchType,
                                        address,
                                        items
                                      );
                                    })()
                                  : ""
                              }
                              className="hovertrans"
                              onClick={() => setOpen(1)}
                            >
                              <div>
                                <BlockIcon />
                              </div>
                              <div className="blockdataItems">
                                {(items.name || items?.tokenName) && (
                                  <p>
                                    {items?.tokenName || items?.name}{" "}
                                    {items.symbol || items?.tokenSymbol
                                      ? `(${
                                          items.symbol || items?.tokenSymbol
                                        })`
                                      : ""}
                                    {items.price && <span>{items.price}</span>}
                                  </p>
                                )}
                                <p>
                                  {items.address ||
                                    items?.contractAddress ||
                                    items?.contract_address}
                                </p>
                              </div>
                            </Link>
                          </div>
                          {id !== searchResult?.results[item].length - 1 && (
                            <div class="filter-result__divider"></div>
                          )}
                        </li>
                      ))}
                  </section>
                ))}
            </div>
          </div>
          {err && <Page />}
          <div class="filter-result__divider"></div>

          <div class="filter-result__footer">
            <div class="filter-result__footer-group">
              <p class="filter-result__footer-text">
                {" "}
                <NavigateUp /> <NavigateDown /> Navigate
              </p>
            </div>

            <div class="filter-result__footer-group">
              <div class="filter-result__footer-key filter-result__footer-key--esc">
                ESC
              </div>
              <p class="filter-result__footer-text">Close</p>
            </div>

            <div class="filter-result__footer-group">
              <div class="filter-result__footer-key filter-result__footer-key--enter"></div>
              <p class="filter-result__footer-text">
                {" "}
                <span className="enterkeyIcon">
                  {" "}
                  <EnterKeyIcon />
                </span>{" "}
                Enter
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(FilterResult);
