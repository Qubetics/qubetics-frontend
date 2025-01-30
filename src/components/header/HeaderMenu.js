import {
  BlockchainHeaderFunction,
  contractHeaderFunction,
  defaultChainOptions,
  EXPLORER_CHAIN_NAME,
  EXPLORER_METAMASK_NETWORK_URL,
  METAMASK_DAPP_URL,
  Routes,
  SHOW_FAUCET,
} from "@/constant/constant";
import metamaskSDK from "@web3-onboard/metamask";
import { init, useConnectWallet } from "@web3-onboard/react";
import { Select, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Web3 from "web3";
import CheckIcon from "../../../public/SvgIcons";
import { addQubetic } from "../AddQubeticsNetwork/addQubetics";
import { useGetNetwork } from "../contexts/networkChanged";
import "./header.scss";
const metamaskSDKWallet = metamaskSDK({
  options: {
    injectProvider: true,
    extensionOnly: true,
    logging: {
      developerMode: false,
    },
    dappMetadata: {
      name: "Qubetics",
      url: METAMASK_DAPP_URL,
    },
  },
});

init({
  wallets: [metamaskSDKWallet],
  chains: defaultChainOptions,

  accountCenter: {
    desktop: {
      enabled: false, // Disable the pop-up account center on desktop
    },
    mobile: {
      enabled: false, // Disable the pop-up account center on mobile
    },
  },
});
function HeaderMenu({ onCloseDrawer }) {
  const [windowWidth, setWindowWidth] = useState(0);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWindowWidth(window.innerWidth);
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const router = useRouter();
  const { setIsNetworkChanged, setIsEvm } = useGetNetwork();

  let val = typeof window !== "undefined" && localStorage.getItem("chainType");
  const [chainType, setChainType] = useState("EVM Chain");
  const [isMetaMaskAdded, setIsMetaMaskAdded] = useState(false);
  const pathname = usePathname();

  // useEffect(() => {
  //   const cookieValue = getCookie("isEVM");
  //   if (cookieValue === undefined) {
  //     setCookie("isEVM", true, {
  //       maxAge: 24 * 60 * 60, // 24 hours in seconds
  //       expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  //       path: "/",
  //     });
  //   }
  //   if (chainType === "EVM Chain") {
  //     setCookie("isEVM", true, {
  //       maxAge: 24 * 60 * 60, // 24 hours in seconds
  //       expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  //       path: "/",
  //     });
  //   } else {
  //     setCookie("isEVM", false, {
  //       maxAge: 24 * 60 * 60, // 24 hours in seconds
  //       expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  //       path: "/",
  //     });
  //   }
  // }, []);
  const handleChainChange = (e) => {
    // setChainType(e);
    // setIsNetworkChanged(true);
    // if (e == "EVM Chain") {
    //   setCookie("isEVM", true, {
    //     maxAge: 24 * 60 * 60, // 24 hours in seconds
    //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    //     path: "/",
    //   });
    //   router.push("/dashboard");
    //   setIsEvm(true);
    // } else {
    //   setCookie("isEVM", false, {
    //     maxAge: 24 * 60 * 60, // 24 hours in seconds
    //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    //     path: "/",
    //   });
    //   router.push("/dashboard");
    //   setIsEvm(false);
    // }
    // window.location.reload();
  };
  const isNetworkAdded = async () => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        EXPLORER_METAMASK_NETWORK_URL ? EXPLORER_METAMASK_NETWORK_URL : ""
      )
    );
    const chain_Id = await web3.eth.getChainId();
    const chainIdHex = `0x${chain_Id.toString(16)}`;
    const { ethereum } = window;
    if (!ethereum) return;
    try {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      setIsMetaMaskAdded(chainId === chainIdHex);
      ethereum.on("chainChanged", (id) => {
        if (id === chainIdHex) return setIsMetaMaskAdded(true);
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

  // const addChainNetwork = async () => {
  //   const deviceType = getDeviceType();
  //   if (deviceType !== "Desktop") {
  //     const metamaskDappUrl =
  //       process.env.NEXT_PUBLIC_METAMASK_DAPP_URL || "https://google.com";
  //     window.location.href = metamaskDappUrl;
  //     return;
  //   }
  //   const requestProvider = await connect({
  //     autoSelect: {
  //       label: "MetaMask",
  //       disableModals: true, // Ensure modals are disabled
  //     },
  //   });
  //   const provider = requestProvider[0]?.provider;
  //   try {
  //     if (!provider) {
  //       throw new Error(Messages.Install_Metamask);
  //     }
  //     const chainId = await provider.request({ method: "eth_chainId" });

  //     const ChainIdQubetic = EXPLORER_META_NETWORK_CHAIN_ID;

  //     if (!provider) {
  //       toast.info(Messages.Install_Metamask);
  //     } else {
  //       if (!chainId) {
  //         throw new Error(Messages.Retrive_Meta_Account);
  //       }
  //       console.log(chainId === ChainIdQubetic, "chain");
  //       if (chainId === ChainIdQubetic) {
  //         toast.success(Messages.Same_Network);
  //         // setIsMetaMaskAdded(true);
  //       } else {
  //         try {
  //           await provider.request({
  //             method: "wallet_switchEthereumChain",
  //             params: [{ chainId: ChainIdQubetic }],
  //           });
  //           toast.success(Messages.Successfully_Switched);
  //           // setIsMetaMaskAdded(true);
  //         } catch (switchError) {
  //           if (switchError.code === 4902) {
  //             try {
  //               await provider.request({
  //                 method: "wallet_addEthereumChain",
  //                 params: [
  //                   {
  //                     chainId: ChainIdQubetic,
  //                     chainName: METAMASK_CHAIN_NAME,
  //                     nativeCurrency: {
  //                       symbol: EXPLORER_CURRENCY_NAME,
  //                       decimals: 18,
  //                     },
  //                     rpcUrls: [EXPLORER_METAMASK_NETWORK_URL],
  //                     blockExplorerUrls: [EXPLORER_METAMASK_NAVIGATION],
  //                   },
  //                 ],
  //               });
  //               toast.success(Messages.Network_Added);
  //               setIsMetaMaskAdded(true);
  //             } catch (err) {
  //               throw new Error(`${Messages.Network_Add_Error} ${err.message}`);
  //               setIsMetaMaskAdded(false);
  //             }
  //           }
  //         }
  //       }
  //     }
  //     await provider.on("chainChanged", (chainId) => {
  //       if (chainId === EXPLORER_META_NETWORK_CHAIN_ID) {
  //         return setIsMetaMaskAdded(true);
  //       }
  //       setIsMetaMaskAdded(false);
  //     });
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };
  useEffect(() => {
    router.prefetch(`/dashboard`);
  }, []);

  return (
    <>
      <ul className="mob__List">
        <li onClick={onCloseDrawer} value="Dashboard">
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
              // trigger={["hover"]}
              title=""
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
                pathname, // Passed the current pathname
                onCloseDrawer
              )}
              tooltip={true}
            />
          </Space>
        </li>
        {val === "EVM Chain" && (
          <li onClick={onCloseDrawer}>
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
        <li onClick={onCloseDrawer}>
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
        <li onClick={onCloseDrawer}>
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
                title=""
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
                options={contractHeaderFunction(pathname, onCloseDrawer)}
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
        {/* <li className="headerSelct"> */}
        {/* <button className="qubeticNetwork_btn" onClick={addQubetic}>
            <span>
              <Image src="/metafox.avif" width={25} height={25} alt="metafox" />
              Add {EXPLORER_CHAIN_NAME} Network
            </span>
          </button> */}
        {/* </li> */}
      </ul>
      <ul className="mob__List">
        <li className="headerSelct headerMeta" style={{ borderBottom: "0" }}>
          <div className="cmnSelct">
            <a className="headermetaBtn" onClick={addQubetic}>
              <span
                style={{ gap: "5px", display: "flex", alignItems: "center" }}
                class="_button-text_1x6ja_100"
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
            </a>
            <button className="headermetaBtn" style={{ minWidth: "120px" }}>
              EVM Chain
            </button>
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