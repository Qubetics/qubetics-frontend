import { customToast } from "@/components/common/toast";
import { Messages } from "@/constant/constant";
import postContractVerifictaionIcon from "@/services/postContractVerifictaionIcon";
import { ethers } from "ethers";

export const signMessage = async (
  contractAdress,
  url,
  setIsLoading,
  setUrl,
  setContractAddress
) => {
  try {
    if (!window.ethereum) throw new Error(Messages.Install_Metamask);

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const messageHash = await ethers.utils.hashMessage(contractAdress);
    const signature = await signer.signMessage(contractAdress);

    const data = {
      messageHash: messageHash,
      address: contractAdress,
      signature: signature,
      iconUrl: url,
    };

    if (data) {
      setIsLoading(true);
      const res = await postContractVerifictaionIcon(data);
      if ((res && res.status == "401") || (res && res.status == "404")) {
        setIsLoading(false);
        customToast.error(res?.message);
      } else if (res && res?.isVerified) {
        setIsLoading(false);
        customToast.success(res?.message);
      } else {
        return;
      }
      setUrl("");
      setContractAddress("");
    }

    return;
  } catch (err) {
    setIsLoading(false);
    customToast.error(err.message);
  }
};
