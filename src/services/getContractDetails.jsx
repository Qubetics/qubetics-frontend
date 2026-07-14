import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getContractDetails(hash, forceEvm) {
  let chain = (typeof window) !== 'undefined' && localStorage.getItem('chainType')
  // For now chain-abstraction (QCA) contracts are only served by the EVM
  // explorer, so callers can pass forceEvm to bypass the chainType toggle.
  const baseUrl =
    forceEvm || chain == 'EVM Chain' ? EXPLORER_API_URL : NATIVE_EXPLORER_API_URL
  const response = await fetch(
    `${baseUrl}contracts/contract-detail-by-address/${hash}`
  )

  let result = await response.json();
  return result;
}
