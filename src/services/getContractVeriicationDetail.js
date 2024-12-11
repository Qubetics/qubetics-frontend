import { EXPLORER_CONTRACT_VERIFY_URL } from "@/constant/constant";

export default async function getContractVerificationDetail(contractAddress) {
  try {
    const response = await fetch(
      `${EXPLORER_CONTRACT_VERIFY_URL}detail/${contractAddress}`
    );

    let result = await response.json();
    return result;
  } catch (error) {
    // console.log(error, "ERR");
    return error;
  }
}
