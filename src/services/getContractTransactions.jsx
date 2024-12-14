import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getContractTransactions(
  currentPage,
  limit,
  hash,
  tab
) {
  let response = [];
  // let chain = (typeof window) !== 'undefined' && localStorage.getItem('chainType')
  // chain == 'EVM Chain' ?
  tab == 0
    ? (response = await fetch(
        `${EXPLORER_API_URL}contracts/all-transaction?page=${currentPage}&limit=${limit}&contractAddress=${hash}`
      ))
    : (response = await fetch(
        `${EXPLORER_API_URL}contracts/transfer?page=${currentPage}&limit=${limit}&contractAddress=${hash}`
      ));
  // : (response = await fetch(
  //   `${NATIVE_EXPLORER_API_URL}contracts/all-transaction?page=${currentPage}&limit=${limit}&contractAddress=${hash}`
  // ))
  let result = await response.json();
  return result;
}
