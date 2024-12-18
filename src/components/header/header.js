"use client";
import { Routes } from "@/constant/constant";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HamburgerIcon } from "../../../public/SvgIcons";
import LogoIcon from "../../assets/svg/NewLogo.svg";
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

  useEffect(() => {
    localStorage.setItem("chainType", chainType);
    setIsNetworkChanged(false);
  }, [chainType]);

  return (
    <>
      <div className={`header-main ${scrolled ? "sticky" : ""}`} id="foo">
        <div className="header-main__bottom container">
          <div>
            <Link href={"/dashboard"}>
              {" "}
              <Image src={LogoIcon} alt="Logo" width={176} height={50} />
            </Link>
          </div>
          <HeaderMenu />
          <li className="hammburgerIcon">
            <span onClick={showDrawer}>
              <HamburgerIcon />
            </span>
          </li>
        </div>
      </div>
    </>
  );
}

export default Header;
