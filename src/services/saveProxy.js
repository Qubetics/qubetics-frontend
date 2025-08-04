import { EXPLORER_CONTRACT_VERIFY_URL } from "@/constant/constant";

export const saveProxy =  async (contractAddress)=> {
  try {
    const response = await fetch(
      `${EXPLORER_CONTRACT_VERIFY_URL}saveProxyContract?contractAddress=${contractAddress}`
    );

    let result = await response.json();
    return result;
  } catch (error) {
    // console.log(error, "ERR");
    return error;
  }
}
