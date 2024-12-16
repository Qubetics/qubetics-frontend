"use client";
import { EXPLORER_CHAIN_NAME, Routes } from "@/constant/constant";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HamburgerIcon } from "../../../public/SvgIcons";
import { useLatestData } from "../contexts/latest_data";
import { useGetNetwork } from "../contexts/networkChanged";
import { useThemeData } from "../contexts/theme_context";
import "./header.scss";
import HeaderMenu from "./HeaderMenu";
import { Drawer } from "antd";

function Header() {
  const router = useRouter();
  const webSocketData = useLatestData();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(null);
  const { toggleDiv, setIsLight } = useThemeData();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { showDiv, setShowDiv } = useThemeData();
  let val = typeof window !== "undefined" && localStorage.getItem("chainType");
  const [chainType, setChainType] = useState(val || "EVM Chain");
  const { setIsNetworkChanged, setIsEvm } = useGetNetwork();
  const [percentage, setPercentage] = useState(0);
  const [currentTokenPrice, setCurrentTokenPrice] = useState(0);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("appTheme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.body.classList.add(storedTheme);
    } else {
      setTheme("darkTheme");
      localStorage.setItem("appTheme", "darkTheme");
      document.body.classList.add("darkTheme");
    }
  }, []);

  useEffect(() => {
    if (theme) {
      document.body.classList.remove("darkTheme", "lightTheme");
      document.body.classList.add(theme);
      localStorage.setItem("appTheme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "darkTheme" ? "lightTheme" : "darkTheme";
    setTheme(newTheme);
    setIsLight(newTheme);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (
      pathname === Routes.FAUCET ||
      pathname === Routes.NODES ||
      pathname === Routes.TRANSACTIONS ||
      pathname === Routes.BLOCKS ||
      pathname === Routes.TOKEN ||
      pathname === Routes.TOKEN_ICON
    ) {
      setShowDiv(false);
    }
  }, [pathname]);

  const onCloseDrawer = () => {
    setOpen(false);
  };

  const handleChainChange = (e) => {
    setChainType(e);
    setIsNetworkChanged(true);
    if (e == "EVM Chain") {
      router.push("/dashboard");
      setIsEvm(true);
    } else {
      router.push("/dashboard");
      setIsEvm(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("chainType", chainType);
    setIsNetworkChanged(false);
  }, [chainType]);

  // useEffect(() => {
  //   getTokenPriceGraph("1 Day")
  //     .then((res) => {
  //       if (res?.data?.finalData?.length > 0 && res?.data?.currentPrice) {
  //         const oldValue = Object.values(res?.data?.finalData[0])[0][0]?.price;
  //         const newValue = res?.data?.currentPrice;
  //         const percentage = ((newValue - oldValue) / oldValue) * 100;
  //         setPercentage(percentage);
  //         setCurrentTokenPrice(newValue);
  //       }
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // }, []);

  return (
    <>
      {/* <Marquee /> */}
      <div className={`header-main ${scrolled ? "sticky" : ""}`} id="foo">
        {/* <div className="header-main__top">
          <div className="header-main__top__inner container">
            <div className="daylighticons">
              <ul>
                <li className="priceValue">
                  <div>
                    <p>Qubetics Price: </p>
                    <p className="linkItem">
                      ${Number(currentTokenPrice).toFixed(5)}{" "}
                      <span
                        style={{
                          color: Math.sign(percentage) === -1 ? "red" : "green",
                        }}
                      >
                        ({toFixed(percentage, 2)}%)
                      </span>
                    </p>
                  </div>
                  <div style={{ color: "blue" }}>{"|"}</div>
                  <div>
                    <p>Market Cap: </p>
                    <p className="linkItem">
                      {webSocketData?.analytics?.marketCap
                        ? "$" +
                          formatMillionNumber(
                            webSocketData?.analytics?.marketCap
                          )
                        : "0"}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="header-main__top__right">
              <ul className="meta_list">
                <li>
                  <div className="cmnSelct headerSelct">
                    <Select
                      defaultValue={chainType}
                      style={{ width: 120 }}
                      onChange={handleChainChange}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      options={[
                        {
                          value: "EVM Chain",
                          label: "EVM Chain",
                        },
                        {
                          value: "Native Chain",
                          label: "Native Chain",
                        },
                      ]}
                    />
                  </div>
                </li>
                <li>
                  <button className="qubeticNetwork_btn" onClick={addQubetic}>
                    <Image
                      src="/metafox.avif"
                      width={25}
                      height={25}
                      alt="metafox"
                    />
                    Add {EXPLORER_CHAIN_NAME} Network
                  </button> */}
        {/* <button className="signInBtn">Sign In</button> */}
        {/* </li>
              </ul>
            </div>
          </div>
        </div> */}
        <div className="header-main__bottom container">
          <div
            className="svgLogo"
            onClick={toggleDiv}
            title={`${EXPLORER_CHAIN_NAME} Explorer`}
          >
            <img src="./NewLogo.svg" alt="" />
          </div>
          <HeaderMenu />
          <li className="hammburgerIcon">
            <span onClick={showDrawer}>
              <HamburgerIcon />
            </span>
          </li>
          {
            // <Drawer
            //   placement="right"
            //   onClose={onClose}
            //   open={open}
            //   className="drawer_main"
            // >
            //   <div className="drawer_main__side">
            //     <HeaderMenu onCloseDrawer={onClose} />
            //   </div>
            // </Drawer>
          }
        </div>
      </div>
    </>
  );
}

export default Header;
