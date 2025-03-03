"use client";
import {
  EXPLORER_CURRENCY_NAME,
  EXPLORER_METAMASK_NAVIGATION,
  EXPLORER_METAMASK_NETWORK_URL,
  EXPLORER_META_NETWORK_CHAIN_ID,
  METAMASK_CHAIN_NAME,
  Messages,
} from "@/constant/constant";
import { JsonRpcProvider } from "ethers";
import toast from "react-hot-toast";
import Web3 from "web3";

export const addQubeticForVerifyContract = async (setConnectAddress) => {
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      EXPLORER_METAMASK_NETWORK_URL ? EXPLORER_METAMASK_NETWORK_URL : ""
    )
  );
  const chain_Id = await web3.eth.getChainId();
  const chainIdHex = `0x${chain_Id.toString(16)}`;
  const provider = window.ethereum;

  const deviceType = getDeviceType();
  if (deviceType !== "Desktop") {
    if (window.ethereum === undefined) {
      const metamaskDappUrl =
        //  `https://chainid.network/chain/${parseInt(
        //   EXPLORER_META_NETWORK_CHAIN_ID
        // )}`;
        process.env.NEXT_PUBLIC_METAMASK_DAPP_URL || "https://default-url.com";
      window.location.href = metamaskDappUrl;
      return;
    }
  }
  if (!provider) {
    return toast.error(Messages.Install_Metamask);
  }
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
    // customToast.success(toastMessages.METAMASK_CONNECT);
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });
    // If accounts are available, set the connected address
    if (accounts) {
      setConnectAddress(accounts[0]);
    }
  } catch (switchError) {
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: chainIdHex,
              chainName: METAMASK_CHAIN_NAME,
              rpcUrls: [EXPLORER_METAMASK_NETWORK_URL],
              blockExplorerUrls: [EXPLORER_METAMASK_NAVIGATION],
              nativeCurrency: {
                symbol: EXPLORER_CURRENCY_NAME,
                decimals: 18,
              },
            },
          ],
        });
      } catch (err) {
        return err;
      }
    } else {
      if (deviceType !== "Desktop") {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: chainIdHex,
                chainName: METAMASK_CHAIN_NAME,
                rpcUrls: [EXPLORER_METAMASK_NETWORK_URL],
                blockExplorerUrls: [EXPLORER_METAMASK_NAVIGATION],
                nativeCurrency: {
                  symbol: EXPLORER_CURRENCY_NAME,
                  decimals: 18,
                },
              },
            ],
          });
          toast.success(Messages.Network_Added);
        } catch (err) {
          throw new Error(`${Messages.Network_Add_Error} ${err.message}`);
        }
      }
    }
  }
};
export function getDeviceType() {
  const userAgent = navigator.userAgent;

  if (/android/i.test(userAgent)) {
    return "Android";
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  } else if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  } else if (/tablet|iPad/i.test(userAgent)) {
    return "Tablet";
  } else if (/Mobile|Android|iP(ad|hone)/i.test(userAgent)) {
    return "Mobile";
  } else {
    return "Desktop";
  }
}
export const addQubetic = async () => {
  try {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        EXPLORER_METAMASK_NETWORK_URL ? EXPLORER_METAMASK_NETWORK_URL : ""
      )
    );
    const chain_Id = await web3.eth.getChainId();
    const chainIdHex = `0x${chain_Id.toString(16)}`;
    const provider = window.ethereum;

    const deviceType = getDeviceType();
    if (deviceType !== "Desktop") {
      if (window.ethereum === undefined) {
        const metamaskDappUrl =
          process.env.NEXT_PUBLIC_METAMASK_DAPP_URL ||
          "https://default-url.com";
        window.location.href = metamaskDappUrl;
        return;
      }
    }
    if (!provider) {
      throw new Error(Messages.Install_Metamask);
    }

    const chainId = await provider.request({ method: "eth_chainId" });

    const ChainIdQubetic = EXPLORER_META_NETWORK_CHAIN_ID;
    if (!provider) {
      toast.error(Messages.Install_Metamask);
    } else {
      if (!chainId) {
        throw new Error(Messages.Retrive_Meta_Account);
      }

      if (chainId === chainIdHex) {
        toast.success(Messages.Same_Network);
        return;
      }

      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainIdHex }],
        });
        toast.success(Messages.Successfully_Switched);
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainIdHex,
                  chainName: METAMASK_CHAIN_NAME,
                  nativeCurrency: {
                    symbol: EXPLORER_CURRENCY_NAME,
                    decimals: 18,
                  },
                  rpcUrls: [EXPLORER_METAMASK_NETWORK_URL],
                  blockExplorerUrls: [EXPLORER_METAMASK_NAVIGATION],
                },
              ],
            });
            toast.success(Messages.Network_Added);
          } catch (err) {
            throw new Error(`${Messages.Network_Add_Error} ${err.message}`);
          }
        } else {
          if (deviceType !== "Desktop") {
            try {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: chainIdHex,
                    chainName: METAMASK_CHAIN_NAME,
                    rpcUrls: [EXPLORER_METAMASK_NETWORK_URL],
                    blockExplorerUrls: [EXPLORER_METAMASK_NAVIGATION],
                    nativeCurrency: {
                      symbol: EXPLORER_CURRENCY_NAME,
                      decimals: 18,
                    },
                  },
                ],
              });
              toast.success(Messages.Network_Added);
            } catch (err) {
              throw new Error(`${Messages.Network_Add_Error} ${err.message}`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.log("error", "error");
    toast.error(error.message);
  }
};

