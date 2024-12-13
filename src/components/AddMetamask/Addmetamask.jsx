import {
  EXPLORER_CURRENCY_NAME,
  EXPLORER_META_NETWORK_CHAIN_ID,
  EXPLORER_METAMASK_NETWORK_URL,
  Messages,
  METAMASK_CHAIN_NAME,
} from "@/constant/constant";

export const addMetaMask = async (isMobile = false) => {
  // get provider
  const provider = window.ethereum;
  // redirect to daap in case of mobile

  if (isMobile) {
    if (window.ethereum === undefined) {
      const metamaskDappUrl =
        process.env.NEXT_PUBLIC_METAMASK_DAPP_URL || "https://default-url.com";
      window.location.href = metamaskDappUrl;
      return;
    }
  }
  //if no provider gives error

  if (!provider) {
    console.error(Messages.Metamask_not_installed);
    toast.error(Messages.Metamask_not_installed);
    return;
  }
  //get chain Id
  const chainId = await provider.request({ method: "eth_chainId" });
  console.log(chainId,"chianId")

  try {
    if (chainId === EXPLORER_META_NETWORK_CHAIN_ID) {
      toast.success(Messages.Same_Network);
      return;
    }
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: EXPLORER_META_NETWORK_CHAIN_ID }],
    });
    toast.success(Messages.Swtich_Network);
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.

    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: EXPLORER_META_NETWORK_CHAIN_ID,
              chainName: METAMASK_CHAIN_NAME,
              rpcUrls: [EXPLORER_METAMASK_NETWORK_URL] /* ... */,
              //   blockExplorerUrls: [blockExplorerLink],
              nativeCurrency: {
                symbol: EXPLORER_CURRENCY_NAME,
                decimals: 18,
              },
            },
          ],
        });
      } catch (addError) {
        // Handle "add" error.
        console.error("Failed to add the chain to MetaMask", addError);
      }
    } else {
      if (isMobile) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: EXPLORER_META_NETWORK_CHAIN_ID,
                chainName: METAMASK_CHAIN_NAME,
                rpcUrls: [EXPLORER_METAMASK_NETWORK_URL],
                // blockExplorerUrls: [blockExplorerLink],
                nativeCurrency: {
                  symbol: EXPLORER_CURRENCY_NAME,
                  decimals: 18,
                },
              },
            ],
          });
          toast.success(Messages.Network_Added);
        } catch (err) {
          const errParsed = JSON.parse(JSON.stringify(err));
          if ((errParsed.code = -32002))
            throw new Error(Messages.Pending_Network_Add_Metamask);
          throw new Error(`${Messages.Network_Add_Error} ${err.message}`);
        }
      }
    }
  }
};
