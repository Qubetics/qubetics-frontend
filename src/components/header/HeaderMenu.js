import {
  BlockchainHeaderFunction,
  contractHeaderFunction,
  EXPLORER_CHAIN_NAME,
  EXPLORER_METAMASK_NETWORK_URL,
  NodeHeaderFunction,
  Routes,
  SHOW_FAUCET,
} from "@/constant/constant";
import { Select, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Web3 from "web3";
import CheckIcon from "../../../public/SvgIcons";
import { addQubetic } from "../AddQubeticsNetwork/addQubetics";
import "./header.scss";
import { trackEvent } from "@/utils/eventTrack";

function HeaderMenu({ onCloseDrawer }) {
  const router = useRouter();

  const [isMetaMaskAdded, setIsMetaMaskAdded] = useState(false);
  const pathname = usePathname();
  const chainType =
    typeof window !== "undefined" && localStorage.getItem("chainType");

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

  useEffect(() => {
    isNetworkAdded();
  }, []);

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  return (
    <>
      <ul className="mob__List">
        <li key={1} onClick={onCloseDrawer}>
          <Link
            prefetch={true}
            className={pathname === Routes.DASHBOARD ? "active" : "inactive"}
            href={Routes.DASHBOARD}
            onClick={()=>trackEvent({action:"link_click",category:"link",label:"Dashboard_link"})}
          >
            Dashboard
          </Link>
        </li>

        <li key={2}>
          <Space wrap>
            <Select
              title=""
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              className={`headerSelect ${
                pathname.includes(Routes.BLOCKS) ||
                pathname.includes(Routes.TRANSACTIONS)
                  ? "active"
                  : "inactive"
              }`}
              defaultValue="Blockchain"
              value="Blockchain"
              options={BlockchainHeaderFunction(pathname, onCloseDrawer)}
            />
          </Space>
        </li>

        {/* {chainType === "EVM Chain" && ( */}
        <li key={3} onClick={onCloseDrawer}>
          <Link
            prefetch={true}
            className={pathname.includes(Routes.TOKEN) ? "active" : "inactive"}
            href={Routes.TOKEN}
            onClick={()=>trackEvent({action:"link_click",category:"link",label:"Token_link"})}
          >
            Tokens
          </Link>
        </li>
        {/* )} */}

        <li key={4} onClick={onCloseDrawer}>
          <Link
            prefetch={true}
            className={
              pathname.includes(Routes.VALIDATORS) ? "active" : "inactive"
            }
            href={Routes.VALIDATORS}
            onClick={()=>trackEvent({action:"link_click",category:"link",label:"Validators_link"})}
          >
            Validators
          </Link>
        </li>

        {/* <li key={5} onClick={onCloseDrawer}>
          <Link
            prefetch={true}
            className={pathname.includes(Routes.NODES) ? "active" : "inactive"}
            href={Routes.NODES}
          >
            Nodes
          </Link>
        </li> */}
        <li key={2}>
          <Space wrap>
            <Select
              title=""
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              className={`headerSelect ${
                pathname.includes(Routes.NODES) ||
                pathname.includes(Routes.SYNC)
                  ? "active"
                  : "inactive"
              }`}
              defaultValue="Nodes"
              value="Nodes"
              options={NodeHeaderFunction(pathname, onCloseDrawer)}
            />
          </Space>
        </li>

        {/* {chainType === "EVM Chain" && ( */}
        <li key={6}>
          <Space wrap>
            <Select
              title=""
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              className={`headerSelect ${
                pathname.includes(Routes.CONTRACTS) ||
                pathname.includes(Routes.CONTRACT_VERIFICATOIN) ||
                pathname.includes(Routes.TOKEN_ICON)
                  ? "active"
                  : "inactive"
              }`}
              defaultValue="Contracts"
              value="Contracts"
              options={contractHeaderFunction(pathname, onCloseDrawer)}
            />
          </Space>
        </li>
        {/* )} */}

        {SHOW_FAUCET == 1 && (
          <li onClick={onCloseDrawer}>
            <Link
              prefetch={true}
              className={pathname === Routes.FAUCET ? "active" : "inactive"}
              href={Routes.FAUCET}
            >
              Faucet
            </Link>
          </li>
        )}
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
            {/* <div className="evmChain"> */}
            {/* <Select
              className="headerSelectItem"
              getPopupContainer={getContainer}
              defaultValue={chainType}
              style={
                windowWidth < 1199
                  ? { minWidth: "100%", width: "100%", padding: 0 }
                  : { minWidth: 130, width: "130px", padding: 0 }
              }
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
            /> */}
            {/* </div> */}
          </div>
        </li>
      </ul>
    </>
  );
}

export default HeaderMenu;
