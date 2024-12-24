import {
  BlockchainHeaderFunction,
  contractHeaderFunction,
  EXPLORER_CHAIN_NAME,
  EXPLORER_META_NETWORK_CHAIN_ID,
  Routes,
  SHOW_FAUCET,
} from "@/constant/constant";
import { Select, Space } from "antd";
import { getCookie, setCookie } from "cookies-next";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckIcon from "../../../public/SvgIcons";
import { addQubetic } from "../AddQubeticsNetwork/addQubetics";
import { useGetNetwork } from "../contexts/networkChanged";
import "./header.scss";

function HeaderMenu() {
  const router = useRouter();
  const { setIsNetworkChanged, setIsEvm } = useGetNetwork();

  let val = typeof window !== "undefined" && localStorage.getItem("chainType");
  const [chainType, setChainType] = useState(val || "EVM Chain");
  const [isMetaMaskAdded, setIsMetaMaskAdded] = useState(false);
  const pathname = usePathname();

  // const ristrictedPath = ["/token", "/contract", "/verifyContract"];
  // useEffect(() => {
  //   if (val === "Native Chain") {
  //     if (ristrictedPath.includes(pathname)) {
  //       router.push("/dashboard");
  //     }
  //   }
  // }, [pathname]);

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
    setChainType(e);
    setIsNetworkChanged(true);
    if (e == "EVM Chain") {
      setCookie("isEVM", true);
      router.push("/dashboard");
      setIsEvm(true);
      window.location.reload();
    } else {
      setCookie("isEVM", false);
      router.push("/dashboard");
      setIsEvm(false);
      window.location.reload();
    }
  };
  const isNetworkAdded = async () => {
    const { ethereum } = window;
    if (!ethereum) return;
    try {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      setIsMetaMaskAdded(chainId === EXPLORER_META_NETWORK_CHAIN_ID);
      ethereum.on("chainChanged", (id) => {
        if (id === EXPLORER_META_NETWORK_CHAIN_ID)
          return setIsMetaMaskAdded(true);
        setIsMetaMaskAdded(false);
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    isNetworkAdded();
  }, []);

  useEffect(() => {
    localStorage.setItem("chainType", chainType);
    setIsNetworkChanged(false);
  }, [chainType]);
  const getContainer = (triggerNode) => triggerNode.parentNode;

  return (
    <>
      <ul className="mob__List">
        <li value="Dashboard">
          <Link
            prefetch={true}
            className={pathname === Routes.DASHBOARD ? "active" : "inactive"}
            href={Routes.DASHBOARD}
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Space wrap>
            <Select
              trigger={["hover"]}
              getPopupContainer={getContainer}
              className={`headerSelect  ${
                pathname.includes(Routes.BLOCKS) ||
                pathname.includes(Routes.TRANSACTIONS)
                  ? "active"
                  : "inactive"
              }`}
              defaultValue={"Blockchain"}
              // placeholder={
              //   pathname.includes(Routes.BLOCKS)
              //     ? "Blockchain"
              //     : pathname.includes(Routes.TRANSACTIONS)
              //     ? "Transactions"
              //     : "Blockchain"
              // }
              value={"Blockchain"}
              // style={{ width: 119 }}
              options={BlockchainHeaderFunction(
                pathname // Passed the current pathname
                // onCloseDrawer
              )}
              tooltip={false}
            />
          </Space>
        </li>
        {val === "EVM Chain" && (
          <li>
            <Link
              prefetch={true}
              className={
                pathname.includes(Routes.TOKEN) ? "active" : "inactive"
              }
              href={Routes.TOKEN}
            >
              Tokens
            </Link>
          </li>
        )}
        <li>
          <Link
            prefetch={true}
            className={
              pathname.includes(Routes.VALIDATORS) ? "active" : "inactive"
            }
            href={Routes.VALIDATORS}
          >
            Validators
          </Link>
        </li>
        <li>
          <Link
            prefetch={true}
            className={
              pathname.includes(Routes.NODES)
                ? // ||              pathname.includes(Routes.Tx_ADDRESS)
                  "active"
                : "inactive"
            }
            href={Routes.NODES}
          >
            Nodes
          </Link>
        </li>

        {/* {val !== "EVM Chain" && (
          <li>
            <Link
              prefetch={true}
              className={
                pathname.includes(Routes.CONTRACTS) &&
                !pathname.includes("/verify")
                  ? "active"
                  : "inactive"
              }
              href={Routes.CONTRACTS}
              // onClick={() => {
              //   onCloseDrawer();
              //   router.push(`${Routes.CONTRACTS}`);
              // }}
            >
              Contracts
            </Link>
          </li>
        )} */}

        {val == "EVM Chain" && (
          <li>
            <Space wrap>
              <Select
                getPopupContainer={getContainer}
                className={`headerSelect  ${
                  pathname.includes(Routes.CONTRACTS) ||
                  pathname.includes(Routes.CONTRACT_VERIFICATOIN) ||
                  pathname.includes(Routes.TOKEN_ICON)
                    ? "active"
                    : "inactive"
                }`}
                // placeholder={
                //   pathname.includes(Routes.CONTRACTS)
                //     ? "Contract"
                //     : pathname.includes(Routes.CONTRACT_VERIFICATOIN)
                //     ? "Verify Contract"
                //     : "Contract"
                // }
                defaultValue={"Contracts"}
                value={"Contracts"}
                // style={{ minWidth: 139 }}
                options={contractHeaderFunction(pathname)}
              />
            </Space>
          </li>
        )}

        {/* <li>
          <Space wrap>
            <Select
              getPopupContainer={getContainer}
              className={`headerSelect ${
                pathname.includes(Routes.STATS) ||
                (pathname.includes(Routes.TOKEN) &&
                  pathname !== Routes.TOKEN_ICON)
                  ? "active"
                  : "inactive"
              }`}
              defaultValue={"Stats & Charts"}
              value={"Stats & Charts"}
              style={{ minWidth: 60 }}
              options={statsChartsFunction(
                pathname,
                val === chain.EVM,
                onCloseDrawer
              )}
            />
          </Space>
        </li> */}

        {/*
        <li>
          <Link
            className={pathname === Routes.STATS ? "active" : ""}
            href={Routes.STATS}
            onClick={() => {
              onCloseDrawer();
              router.push(`${Routes.STATS}`);
            }}
          >
            Charts And Stats
          </Link>
        </li>
        <li>
          <Link
            className={pathname === Routes.TOKEN ? "active" : ""}
            href={Routes.TOKEN}
            onClick={() => {
              onCloseDrawer();
              router.push(`${Routes.TOKEN}`);
            }}
          >
            Top Tokens
          </Link>
        </li>
        <li>
          <Link
            className={pathname === Routes.VALIDATORS ? "active" : ""}
            href={Routes.VALIDATORS}
            onClick={() => {
              onCloseDrawer();
              router.push("/validators");
            }}
          >
            Validators
          </Link>
        </li>

        <li>
          <Link
            className={pathname === Routes.NODES ? "active" : ""}
            href={Routes.NODES}
            onClick={() => {
              onCloseDrawer();
              router.push(`${Routes.NODES}`);
            }}
          >
            Nodes
          </Link>
        </li>
        */}

        {SHOW_FAUCET == 1 && (
          <li>
            <Link
              prefetch={true}
              className={pathname === Routes.FAUCET ? "active" : "inactive"}
              href={Routes.FAUCET}
            >
              Faucet
            </Link>
          </li>
        )}
        <li className="headerSelct">
          {/* <button className="qubeticNetwork_btn" onClick={addQubetic}>
            <span>
              <Image src="/metafox.avif" width={25} height={25} alt="metafox" />
              Add {EXPLORER_CHAIN_NAME} Network
            </span>
          </button> */}
          <a className="qubeticNetwork_btn" onClick={addQubetic}>
            <span
              style={{ gap: "5px", display: "flex", alignItems: "center" }}
              class="_button-text_1x6ja_100"
            >
              <Image src="/metafox.svg" width={25} height={25} alt="metafox" />
              {isMetaMaskAdded
                ? `${EXPLORER_CHAIN_NAME} Network Added`
                : `Add ${EXPLORER_CHAIN_NAME} Network`}
              {isMetaMaskAdded && <CheckIcon />}
            </span>
          </a>
        </li>
        <li className="headerSelct">
          <div className="cmnSelct">
            <Select
              getPopupContainer={getContainer}
              defaultValue={chainType}
              style={{ width: 130 }}
              // disabled
              onChange={handleChainChange}
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
      </ul>
    </>
  );
}

export default HeaderMenu;
