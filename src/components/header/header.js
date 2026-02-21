"use client";
import { Drawer } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HamburgerIcon } from "../../../public/SvgIcons";
import LogoIcon from "../../assets/svg/NewLogo.svg";
import reslogo from "../../assets/svg/reslogo.svg";
import "./header.scss";
import HeaderMenu from "./HeaderMenu";
import { trackEvent } from "@/utils/eventTrack";

function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
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
    const routeMappings = {
      "/dashboard": "Dashboard",
      "/blocks": "Blockchain",
      "/tx": "Blockchain",
      "/txn": "Blockchain",
      "/token": "Tokens",
      "/validators": "Validators",
      "/nodes": "Nodes",
      "/contract": "Contract",
      "/contract/verify": "Contract",
      "/faucet": "Faucet",
      "/address": "Blockchain",
      "/dVPNNodes": "dVPNNodes",
      "/accounts": "Accounts",
    };

    // Match exact paths or dynamic segments
    const matchedRoute = Object.keys(routeMappings).find((route) =>
      pathname.startsWith(route),
    );

    setRouteText(routeMappings[matchedRoute] || "");
  }, [pathname]);

  return (
    <div className={`header-main ${scrolled ? "sticky" : ""}`}>
      <div className="header-main__bottom container">
        <div>
          <Link
            onClick={() =>
              trackEvent({
                action: "logo_click",
                category: "Header",
                label: "Logo",
              })
            }
            href={"/dashboard"}
          >
            {windowWidth > 1199 ? (
              <Image
                priority
                src={LogoIcon}
                alt="Logo"
                width={176}
                height={50}
              />
            ) : (
              <Image priority src={reslogo} alt="Logo" width={36} height={36} />
            )}
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
      </div>
    </div>
  );
}

export default Header;
