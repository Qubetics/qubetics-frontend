import {
  EXPLORER_CHAIN_NAME,
  EXPLORER_METAMASK_NETWORK_URL,
  SHOW_FAUCET,
} from "@/constant/constant";
import { trackEvent } from "@/utils/eventTrack";
import { Select, Space } from "antd";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Web3 from "web3";
import CheckIcon from "../../../public/SvgIcons";
import { addQubetic } from "../AddQubeticsNetwork/addQubetics";
import { useGetNetwork } from "../contexts/networkChanged";
import "./header.scss";
import { navItems } from "./helper";

function HeaderMenu({ onCloseDrawer }) {
  const router = useRouter();
  const [isMetaMaskAdded, setIsMetaMaskAdded] = useState(false);
  const { setIsNetworkChanged, setIsEvm } = useGetNetwork();
  const pathname = usePathname();

  const val =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  
    const [chainType, setChainType] = useState(val || "EVM Chain");

  useEffect(() => {
    const cookieValue = getCookie("isEVM");
    if (cookieValue === undefined) {
      setCookie("isEVM", true);
    }
    if (val === "EVM Chain") {
      setCookie("isEVM", true);
    } else {
      setCookie("isEVM", false);
    }
  }, []);
  const handleChainChange = (e) => {
    localStorage.setItem("chainType", e);
    setChainType(e);
    setIsNetworkChanged(true);

    const isEvm = e === "EVM Chain";
    setCookie("isEVM", isEvm);
    setIsEvm(isEvm);

    window.location.href = "/dashboard";
  };

  const isNetworkAdded = async () => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(EXPLORER_METAMASK_NETWORK_URL || "")
    );
    const chain_Id = await web3?.eth?.getChainId();
    const chainIdHex = `0x${chain_Id.toString(16)}`;
    const { ethereum } = window;

    if (!ethereum) return;

    try {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      setIsMetaMaskAdded(chainId === chainIdHex);
      ethereum.on("chainChanged", (id) => {
        setIsMetaMaskAdded(id === chainIdHex);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const onEventTrackClick = (label, category) => {
    trackEvent({
      action: "link_click",
      category: category,
      label: label,
    });
    return;
  };
  useEffect(() => {
    isNetworkAdded();
  }, []);

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);
    
  useEffect(() => {
    localStorage.setItem("chainType", chainType);
    setIsNetworkChanged(false);
  }, [chainType]);

  const getContainer = (triggerNode) => triggerNode.parentNode;
  const navItem = navItems(chainType == "EVM Chain");
  return (
    <>
      <ul className="mob__List">
        {navItem.map((item, index) => {
          const isActive = item.matchRoutes?.some((route) =>
            pathname.includes(route)
          );

          if (item.showIfEVM === false && chainType !== "EVM Chain")
            return null;
          if (item.showIfFaucet === false && SHOW_FAUCET !== 1) return null;

          if (item.type === "link") {
            return (
              <li key={index} onClick={onCloseDrawer}>
                <Link
                  prefetch
                  href={item.href}
                  className={isActive ? "active" : "inactive"}
                  onClick={() =>
                    item.eventName && onEventTrackClick(item.eventName, "link")
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          }

          if (item.type === "select") {
            return (
              <li key={index}>
                <Space wrap>
                  <Select
                    title=""
                    getPopupContainer={(node) => node.parentNode}
                    className={`headerSelect ${
                      isActive ? "active" : "inactive"
                    }`}
                    defaultValue={item.label}
                    value={item.label}
                    onChange={onCloseDrawer}
                    options={item.optionsFn(pathname, onEventTrackClick)}
                  />
                </Space>
              </li>
            );
          }

          return null;
        })}
      </ul>

      <ul className="mob__List">
        <li className="headerSelct headerMeta" style={{ borderBottom: "0" }}>
          <div className="cmnSelct">
            <a className="headermetaBtn" onClick={addQubetic}>
              <span
                style={{ gap: "5px", display: "flex", alignItems: "center" }}
              >
                <Image
                  src="/metafox.svg"
                  width={25}
                  height={25}
                  alt="metafox"
                />
                {isMetaMaskAdded
                  ? `${EXPLORER_CHAIN_NAME} Network Added`
                  : `Add ${EXPLORER_CHAIN_NAME} Network`}
                {isMetaMaskAdded && <CheckIcon />}
              </span>
            </a>{" "}
            {/* <button className="headermetaBtn" style={{ minWidth: "120px" }}>
               EVM Chain 
                </button>*/}
            <div className="evmChain">
              <Select
                title=""
                className="headerSelectItem"
                getPopupContainer={getContainer}
                defaultValue={chainType}
                style={{ width: 130 }}
                onChange={handleChainChange}
                options={[
                  {
                    title: "",
                    value: "EVM Chain",
                    label: "EVM Chain",
                  },
                  {
                    title: "",
                    value: "Native Chain",
                    label: "Native Chain",
                  },
                ]}
              />
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}

export default HeaderMenu;
