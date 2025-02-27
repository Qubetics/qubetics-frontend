import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getContractDetails(hash) {
  let chain = (typeof window) !== 'undefined' && localStorage.getItem('chainType')
  const response = 
  // chain == 'EVM Chain' ?
    await fetch(
      `${EXPLORER_API_URL}contracts/contract-detail-by-address/${hash}`
    )
    //  :
    // await fetch(
    //   `${NATIVE_EXPLORER_API_URL}contracts/contract-detail-by-address/${hash}`
    // )

  let result = await response.json();
  return result;
}
