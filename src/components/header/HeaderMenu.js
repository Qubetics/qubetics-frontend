import {
  BlockchainHeaderFunction,
  contractHeaderFunction,
  EXPLORER_CHAIN_NAME,
  Routes,
  SHOW_FAUCET,
} from "@/constant/constant";
import { Select, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addQubetic } from "../AddQubeticsNetwork/addQubetics";
import { useGetNetwork } from "../contexts/networkChanged";
import "./header.scss";

function HeaderMenu() {
  const router = useRouter();
  const { setIsNetworkChanged } = useGetNetwork();

  let val = typeof window !== "undefined" && localStorage.getItem("chainType");
  const [chainType, setChainType] = useState(val || "EVM Chain");
  const pathname = usePathname();

  const handleChainChange = (e) => {
    setChainType(e);
    setIsNetworkChanged(true);
  };

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
            className={pathname === Routes.DASHBOARD ? "active" : "inactive"}
            href={Routes.DASHBOARD}
            // onClick={onCloseDrawer}
            // onClick={() => {
            //   router.push(`${Routes.DASHBOARD}`);
            // }}
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
              value={"Blockchain"}
              style={{ minWidth: 0 }}
              options={BlockchainHeaderFunction(
                pathname // Passed the current pathname
                // onCloseDrawer
              )}
            />
          </Space>
        </li>

        <li>
          <Link
            className={
              pathname.includes(Routes.VALIDATORS) ? "active" : "inactive"
            }
            href={Routes.VALIDATORS}
            // onClick={() => {
            //   onCloseDrawer();
            //   router.push(`${Routes.VALIDATORS}`);
            // }}
          >
            Validators
          </Link>
        </li>
        <li>
          <Link
            className={
              pathname.includes(Routes.NODES) ||
              pathname.includes(Routes.Tx_ADDRESS)
                ? "active"
                : "inactive"
            }
            href={Routes.NODES}
            // onClick={() => {
            //   onCloseDrawer();
            //   router.push(`${Routes.NODES}`);
            // }}
          >
            Nodes
          </Link>
        </li>

        {val !== "EVM Chain" && (
          <li>
            <Link
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
        )}

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
                defaultValue={"Contracts"}
                value={"Contracts"}
                style={{ minWidth: 60 }}
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
              className={pathname === Routes.FAUCET ? "active" : "inactive"}
              href={Routes.FAUCET}
              onClick={() => {
                onCloseDrawer();
                router.push(`${Routes.FAUCET}`);
              }}
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
            <span className="_button-text_1x6ja_100">
              <Image src="/metafox.avif" width={25} height={25} alt="metafox" />
              Add {EXPLORER_CHAIN_NAME} Network
            </span>
          </a>
        </li>
        <li className="headerSelct">
          <div className="cmnSelct">
            <Select
              getPopupContainer={getContainer}
              defaultValue={chainType}
              style={{ width: 180 }}
              onChange={handleChainChange}
              options={[
                {
                  value: "EVM Chain",
                  label: "EVM Chain",
                },
                // {
                //   value: "Native Chain",
                //   label: "Native Chain",
                // },
              ]}
            />
          </div>
        </li>
      </ul>
    </>
  );
}

export default HeaderMenu;
