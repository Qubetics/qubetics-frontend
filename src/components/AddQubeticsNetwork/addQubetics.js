import {
  EXPLORER_METAMASK_NAVIGATION,
  EXPLORER_METAMASK_NETWORK_URL,
  EXPLORER_META_NETWORK_CHAIN_ID,
  Messages,
  EXPLORER_CURRENCY_NAME,
  METAMASK_CHAIN_NAME,
} from "@/constant/constant";
import { customToast } from "../common/toast";
import metamaskSDK from "@web3-onboard/metamask";
import { init, useConnectWallet } from "@web3-onboard/react";

const chains = [
  {
    id: "0x1",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: `https://rpc.ankr.com/eth`,
  },
  {
    id: "0xa",
    token: "ETH",
    label: "Optimism",
    rpcUrl: "https://rpc.ankr.com/optimism",
  },
  {
    id: "0x2105",
    token: "ETH",
    label: "Base",
    rpcUrl: "https://mainnet.base.org",
  },
  {
    id: "0xa4b1",
    token: "ETH",
    label: "Arbitrum One",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  {
    id: "0xfa",
    token: "FTM",
    label: "Fantom",
    rpcUrl: "https://rpc.fantom.network",
  },
  {
    id: "0x38",
    token: "BNB",
    label: "Binance Smart Chain",
    rpcUrl: `https://bsc-dataseed.binance.org`,
  },
  {
    id: "0x89",
    token: "MATIC",
    label: "Matic Mainnet",
    rpcUrl: "https://matic-mainnet.chainstacklabs.com",
  },
  {
    id: "0xa86a",
    token: "AVAX",
    label: "Avalanche Mainnet",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
  },
  {
    id: "0xa4ec",
    token: "CELO",
    label: "Celo Mainnet",
    rpcUrl: "https://rpc.ankr.com/celo",
  },
  {
    id: "0x64",
    token: "XDAI",
    label: "Gnosis Chain",
    rpcUrl: "https://rpc.gnosischain.com/",
  },
  {
    id: "0x44d",
    token: "ETH",
    label: "Polygon zkEVM",
    rpcUrl: "https://zkevm-rpc.com",
  },
  {
    id: "0xe708",
    token: "ETH",
    label: "Linea",
    rpcUrl: "https://linea.drpc.org",
  },
  {
    id: "0x1388",
    token: "MNT",
    label: "Mantle",
    rpcUrl: "https://rpc.mantle.xyz",
  },
];
const metamaskSDKWallet = metamaskSDK({
  options: {
    extensionOnly: false,
    logging: {
      developerMode: true,
    },
    dappMetadata: {
      name: "Demo Web3Onboard",
    },
  },
});

init({
  // ... other Onboard options
  wallets: [
    metamaskSDKWallet,
    //... other wallets
  ],
  chains,
});

export const addQubeticForVerifyContract = async (setConnectAddress) => {
  const provider = window.ethereum;
  const ChainIdQubetics = EXPLORER_META_NETWORK_CHAIN_ID;

  if (!provider) {
    customToast.info(Messages.Install_Metamask);
  } else {
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ChainIdQubetics }],
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
                chainId: ChainIdQubetics,
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
      }
    }
  }
};
function getDeviceType() {
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
// export const addQubetic = async () => {
//   try {
//     const deviceType = getDeviceType();
//     const provider = window.ethereum;
//     if (deviceType !== "Desktop") {
//       if (provider === undefined) {
//         const metamaskDappUrl =
//           //  `https://chainid.network/chain/${parseInt(
//           //   EXPLORER_META_NETWORK_CHAIN_ID
//           // )}`;
//           process.env.NEXT_PUBLIC_METAMASK_DAPP_URL ||
//           "https://default-url.com";
//         window.location.href = metamaskDappUrl;
//         return;
//       }
//     }
//     if (!window.ethereum || window.ethereum.isMetaMask === false) {
//       throw new Error(Messages.Install_Metamask);
//     }

//     const chainId = await provider.request({ method: "eth_chainId" });

//     const ChainIdQubetic = EXPLORER_META_NETWORK_CHAIN_ID;

//     if (!provider) {
//       customToast.info(Messages.Install_Metamask);
//     } else {
//       if (!chainId) {
//         throw new Error(Messages.Retrive_Meta_Account);
//       }
//       if (chainId === ChainIdQubetic) {
//         customToast.success(Messages.Same_Network);
//       } else {
//         try {
//           await provider.request({
//             method: "wallet_switchEthereumChain",
//             params: [{ chainId: ChainIdQubetic }],
//           });
//           customToast.success(Messages.Successfully_Switched);
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
//               customToast.success(Messages.Network_Added);
//             } catch (err) {
//               throw new Error(`${Messages.Network_Add_Error} ${err.message}`);
//             }
//           }
//         }
//       }
//     }
//   } catch (error) {
//     console.log("error", "error");
//     customToast.error(error.message);
//   }
// };

// export const addQubetic = async () => {
//   const web3Modal = new Web3Modal({
//     cacheProvider: true, // Optional: Caches the provider between sessions
//     providerOptions: {
//       injected: {
//         display: {
//           name: "MetaMask",
//           description: "Connect with the provider in your browser",
//         },
//         package: null, // Use injected package for MetaMask and other wallet extensions
//       },
//     },
//   });

//   try {
//     const instance = await web3Modal.connect();
//     const newProvider = new Web3Provider(instance); // Create a Web3Provider with the instance
//     // Fetch and log the current network
//     const network = await newProvider.getNetwork();
//     console.log("Connected to network", network);
//   } catch (error) {
//     console.error("Connection failed", error);
//   }

//   switchChain(newProvider);
// };
// const switchChain = async (provider) => {
//   const ChainIdQubetic = EXPLORER_META_NETWORK_CHAIN_ID;
//   const chainData = {
//     chainId: ChainIdQubetic, // Chain ID in hexadecimal format
//     chainName: METAMASK_CHAIN_NAME,
//     nativeCurrency: {
//       symbol: EXPLORER_CURRENCY_NAME,
//       decimals: 18,
//     },
//     rpcUrls: [EXPLORER_METAMASK_NETWORK_URL], // RPC URL for Ethereum Mainnet
//     blockExplorerUrls: [EXPLORER_METAMASK_NAVIGATION],
//   };
//   try {
//     const chainId = "0x1"; // Ethereum Mainnet Chain ID
//     // Try to switch to Ethereum Mainnet
//     await provider.provider.request({
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId }],
//     });

//     console.log("Switched to Ethereum Mainnet");
//   } catch (error) {
//     if (error.code === 4902) {
//       // If the chain is not already added, add it
//       await provider.provider.request({
//         method: "wallet_addEthereumChain",
//         params: [chainData],
//       });
//       console.log("Added Ethereum Mainnet");
//     } else {
//       console.error("Error switching chain:", error);
//     }
//   }
// };
export const addQubetic = async () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  wallet?.provider
    .request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x89",
          chainName: "Polygon",
          blockExplorerUrls: ["https://polygonscan.com"],
          nativeCurrency: { symbol: "MATIC", decimals: 18 },
          rpcUrls: ["https://polygon-rpc.com/"],
        },
      ],
    })
    .then(() => {
      const confirmation = document.getElementById("confirmation");
      confirmation.style.display = "block";
      confirmation.innerText = "Polygon has been added to MetaMask.";
    })
    .catch((error) => {
      console.log(`error: `, error);
    });
};
