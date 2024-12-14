import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getSearchingValue(value) {
  let chain = (typeof window) !== 'undefined' && localStorage.getItem('chainType')
  const response =
  //  chain == 'EVM Chain' ?
    await fetch(
      `${EXPLORER_API_URL}explorer/searching?value=${value}`
    ) 
    // : await fetch(
    //   `${NATIVE_EXPLORER_API_URL}explorer/searching?value=${value}`
    // )
  let result = await response.json();
  return result;
}
