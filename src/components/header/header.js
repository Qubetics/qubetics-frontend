"use client";
import { Routes } from "@/constant/constant";
import { Drawer } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HamburgerIcon } from "../../../public/SvgIcons";
import LogoIcon from "../../assets/svg/NewLogo.svg";
import reslogo from "../../assets/svg/reslogo.svg";
import { useLatestData } from "../contexts/latest_data";
import { useGetNetwork } from "../contexts/networkChanged";
import { useThemeData } from "../contexts/theme_context";
import "./header.scss";
import HeaderMenu from "./HeaderMenu";

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
  const [routeText, setRouteText] = useState("");
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth);
    };

    updateWindowWidth();
    window.addEventListener("resize", updateWindowWidth);
    return () => {
      window.removeEventListener("resize", updateWindowWidth);
    };
  }, []);

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
    window.scrollTo(0, 0);
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

  // useEffect(() => {
  //   localStorage.setItem("chainType", chainType);
  //   setIsNetworkChanged(false);
  // }, [chainType]);

  useEffect(() => {
    const routeMappings = {
      "/dashboard": "Dashboard",
      "/blocks": "Blockchain",
      "/tx": "Blockchain",
      "/token": "Tokens",
      "/validators": "Validators",
      "/nodes": "Nodes",
      "/contract": "Contract",
      "/contract/verify": "Contract",
      "/faucet": "Faucet",
      "/address": "Blockchain",
    };

    // Match exact paths or dynamic segments
    const matchedRoute = Object.keys(routeMappings).find((route) =>
      pathname.startsWith(route)
    );

    setRouteText(routeMappings[matchedRoute] || "");
  }, [pathname]);

  return (
    <>
      <div className={`header-main ${scrolled ? "sticky" : ""}`} id="foo">
        <div className="header-main__bottom container">
          <div>
            <Link href={"/dashboard"}>
              {windowWidth > 1199 ? (
                <Image
                  priority
                  src={LogoIcon}
                  alt="Logo"
                  width={176}
                  height={50}
                />
              ) : (
                <Image
                  priority
                  src={reslogo}
                  alt="Logo"
                  width={36}
                  height={36}
                />
              )}
            </Link>
            <Link href={"/dashboard"} className="responsiveLogo">
              {" "}
            </Link>
          </div>
          <p className="responsiveText">
            {windowWidth > 1199 ? "" : <span>{routeText}</span>}
          </p>
          <HeaderMenu />
          <li className="hammburgerIcon">
            <span onClick={showDrawer}>
              <HamburgerIcon />
            </span>
          </li>
          {
            <Drawer
              placement="right"
              onClose={onClose}
              open={open}
              className="drawer_main"
            >
              <div className="drawer_main__side">
                <HeaderMenu onCloseDrawer={onClose} />
              </div>
            </Drawer>
          }
        </div>
      </div>
    </>
  );
}

export default Header;
