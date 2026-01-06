import { Messages } from "@/constant/constant";
import postContractVerifictaionIcon from "@/services/postContractVerifictaionIcon";
import { ethers } from "ethers";
import { customToast } from "@/components/common/toast";

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
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const messageHash = await ethers.hashMessage(contractAdress);
    const signature = await (await signer).signMessage(contractAdress);
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
    const errParsed = JSON.parse(JSON.stringify(err));
    if (errParsed?.info?.error?.code == 4001)
      return customToast.error("User rejected the request");
    customToast.error(errParsed?.shortMessage);
  }
};
