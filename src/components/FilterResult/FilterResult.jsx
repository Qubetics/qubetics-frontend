import { memo, useEffect, useRef, useState } from "react";
import { BlockIcon, Searchicon } from "../../../public/SvgIcons";
import "./FilterResult.scss";

// import useOnClickOutside from "@/hooks/useOnClickOutSide";

// import useToggleChainContext from "@/hooks/useToggleChainContext";
import { useRouter } from "next/navigation";
import { EnterKeyIcon, NavigateDown, NavigateUp } from "../../../public/SvgIcons";
import useGlobalSearch from "@/hooks/useGlobalSearch";
import Link from "next/link";
import useOnClickOutside from "@/hooks/useoutsideClick";
import { firstCapitalLetter } from "@/constant/constant";

const FilterResult = () => {
  const { searchText, setSearchText, isLoading, setIsLoading, searchResult, dynamicTab, setDynamicTab, setSearchResult } = useGlobalSearch();

  const tabs = dynamicTab || [];
  const inputRef = useRef();
  const wrapperRef = useRef();
  const containerRef = useRef();
  const countRef = useRef(0);
  // const { isEVM } = useToggleChainContext();

  const customRef = useRef({});
  const [open, setOpen] = useState(2);
  const [activeTab, setActiveTab] = useState("");
  const [selectedIndex, setSelectedIndex] = useState();
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

  useEffect(() => {
    if (dynamicTab && dynamicTab.length > 0) {
      setActiveTab(dynamicTab[0]); // Set the first tab as active
    } else setOpen(1);
  }, [dynamicTab]);

  useEffect(() => {
    !searchText && setDynamicTab([]);
  }, [searchText]);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveTab(entry.target.id);
        }
      });
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
    // if (customRef.current["contracts"])
    //   observer.observe(customRef.current["contracts"]);
    // if (addressSectionRef.current) observer.observe(addressSectionRef.current);

    // return () => {
    //   if (tokenSectionRef.current) observer.unobserve(tokenSectionRef.current);
    //   if (addressSectionRef.current)
    //     observer.unobserve(addressSectionRef.current);
    // };
  }, [dynamicTab]);

  const handleToggle = (_elem) => {
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
    const targetedItem = selectedItems?.filter((items, id) => id === selectedIndex);
    targetedItem?.map((ele) => {
      // if (activeTab !== "tokens" && activeTab !== "contracts") {
      router.push(ele?.address && handleKeyEnter(undefined, ele?.address));
      // } else {
      //   router.push(`/contract/evm/${ele?.address}`);
      // }
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
      countRef.current = 0;
      setSelectedIndex((prevIndx) => {
        let idx = Math.min(prevIndx + 1, selectedItems?.length);
        if (idx >= selectedItems?.length) {
          const nextTab = tabIndex + 1;
          if (nextTab && nextTab < tabs.length) {
            setActiveTab(tabs[tabIndex + 1]);
            idx = 0;
          } else {
            idx = prevIndx;
          }
        } else if (containerRef.current && idx % 3 === 0 && idx !== 0) {
          containerRef.current.scrollTop += 100; // Scroll the filter container down
        }
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
        if (containerRef.current && idx != selectedItems?.length - 2) {
          countRef.current += 1;
          // scroll to top a little more once if UP arrow key is entered more than 10 times (to prevent hiding of selected item)
          if (countRef.current > 10) {
            countRef.current = 0;
            containerRef.current.scrollTop -= 75;
          }
          containerRef.current.scrollTop -= 25; // Scroll the filter container up
        }
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

      if (!searchResult?.results?.[activeTab]?.length) return router.push("/not-found");

      const redirectAddress = searchResult?.results[activeTab]?.[0]?.address;

      switch (activeTab) {
        case "transaction":
          if (isEVM) return router.push(`/tx/${redirectAddress}`);
          return router.push(`/extrinsic/${redirectAddress}`);
        case "block":
          return router.push(`/block/${redirectAddress}`);
        case "contract":
          return router.push(`/contract/${redirectAddress}`);
        case "tokens":
          return router.push(`/contract/${redirectAddress}`);
        case "contracts":
          return router.push(`/contract/${redirectAddress}`);
        case "transactions":
          return router.push(`/address/${redirectAddress}`);
        case "account":
          return router.push(`/account/${redirectAddress}`);
        default:
          return router.push(`/address/${redirectAddress}`);
      }
    } else {
      switch (activeTab) {
        case "transaction":
          return `/tx/${selectedAddress}`;

        case "block":
          return `/block/${selectedAddress}`;
        case "contract":
          return `/contract/${selectedAddress}`;
        case "tokens":
          return `/contract/${selectedAddress}`;
        case "contracts":
          return `/contract/${selectedAddress}`;
        case "transactions":
          return `/address/${selectedAddress}`;
        case "account":
          return `/account/${selectedAddress}`;
        default:
          return `/address/${selectedAddress}`;
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
            placeholder="Search By Tx Hash/Address/Block/Block Hash/Verified Contract Name"
            onFocus={() => {
              window.removeEventListener("scroll", preventOuterScroll);
              searchText.length >= 1 && setOpen(2);
            }}
            inputRef={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(1);

              if (e.key === "Enter") {
                // handleKeyEnter(searchResult);
                handleKeyEnter(e);
                // setSearchResult(null);
              }

              // make it navigatable on arrow down & arrow up
              if (["ArrowDown", "ArrowUp"].includes(e.key) && dynamicTab?.length > 0) wrapperRef.current?.focus();

              e.stopPropagation();
            }}
            onChange={(e) => {
              setOpen(2);
              setSearchText(e.target.value);
              setIsLoading(!!e.target.value);
            }}
            value={searchText}
            isLoading={isLoading}
          />
          <Searchicon />
        </div>
      </div>
      {/* <input type="text" class="filter-result__input" placeholder="Search By Tx Hash/Address/Block/Block Hash/Verified Contract Name" /> */}
      {open === 2 && (
        <div ref={wrapperRef} onKeyDown={handleKeyDown} className="filter-result__results" tabindex="0">
          <div class="filter-result__tabs">
            {dynamicTab?.length > 0 &&
              dynamicTab?.map((elem) => (
                <button key={elem} className={` ${activeTab === elem ? "active-tab headermetaBtn" : "inactive-tab"}`} onClick={() => handleToggle(elem)}>
                  {firstCapitalLetter(elem)}
                </button>
              ))}
          </div>

          <div class="filter-result__divider"></div>

          <div ref={containerRef} class="filter-result__container">
            <div class="filter-result__container-inner">
              {dynamicTab?.length > 0 &&
                dynamicTab?.map((item) => (
                  <section key={item} id={item} ref={(ele) => setCustomRef(item, ele)} class="filter-result__section">
                    <div class="filter-result__section-title">{firstCapitalLetter(item)}</div>
                    {/* <ul>
                <li class="filter-result__item filter-result__item--selected">
                  <a href="#" class="filter-result__item-link">
                    <img src="logo.png" alt="Logo" height="38" />
                    <div class="filter-result__item-content">
                      <p class="filter-result__item-title">
                        Name (Symbol)
                        <span class="filter-result__item-price">Price</span>
                      </p>
                      <p class="filter-result__item-address">Address</p>
                    </div>
                  </a>
                  <div class="filter-result__divider"></div>
                </li>
              </ul> */}
                    {searchResult &&
                      searchResult?.results?.[item]?.map((items, id) => (
                        <li key={`${items.address}-${id}`} className={`filter-result__item ${selectedIndex !== null && selectedIndex === id && activeTab === items ? "active-item" : "active-item"}`}>
                          <div className="">
                            <Link
                              href={items?.address || items?.contractAddress ? (items?.address || items?.contractAddress) && handleKeyEnter(undefined, items?.address || items?.contractAddress) : ""}
                              className="hovertrans"
                              // onClick={() => setOpen(1)}
                            >
                              <div>
                                <BlockIcon />
                              </div>
                              <div className="blockdataItems">
                                {(items.name || items?.tokenName) && (
                                  <p>
                                    {items?.tokenName} ({items.symbol || items?.tokenSymbol})<span>{items.price}</span>
                                  </p>
                                )}
                                <p>
                                  {
                                    // isMobile
                                    //   ? formatAddress(items.address)
                                    //   :
                                    items.address || items?.contractAddress
                                  }
                                </p>
                              </div>
                            </Link>
                          </div>
                          {id !== searchResult?.results[item].length - 1 && <div class="filter-result__divider"></div>}
                        </li>

                        // <div className="blockdataItems">
                        //   <BlockIcon />
                        //   <p>
                        //     {" "}
                        //     Mainnet Test
                        //     <span>0x545b794a9feb9000094f63dc6f64e </span>
                        //   </p>
                        // </div>
                      ))}
                  </section>
                ))}
            </div>
          </div>

          <div class="filter-result__divider"></div>

          <div class="filter-result__footer">
            <div class="filter-result__footer-group">
              <p class="filter-result__footer-text">
                {" "}
                <NavigateUp /> <NavigateDown /> Navigate
              </p>
            </div>

            <div class="filter-result__footer-group">
              <div class="filter-result__footer-key filter-result__footer-key--esc">ESC</div>
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
