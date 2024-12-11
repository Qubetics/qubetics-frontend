import { EXPLORER_CONTRACT_VERIFY_URL } from "@/constant/constant";

export default async function getContractStatus(contractAddress) {
  try {
    const response = await fetch(
      `${EXPLORER_CONTRACT_VERIFY_URL}detail/${contractAddress}`
    );
    let result = await response.status;
    return result;
  } catch (error) {
    return error;
  }
}
