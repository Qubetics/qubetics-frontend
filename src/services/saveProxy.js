import { EXPLORER_CONTRACT_VERIFY_URL } from "@/constant/constant";

export default async function saveProxy(contractAddress) {
  try {
    const response = await fetch(
      `${EXPLORER_CONTRACT_VERIFY_URL}saveProxyContract?contractAddress=${contractAddress}`
    );

    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
