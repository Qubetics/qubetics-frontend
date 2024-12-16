import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getTransactionByBlocks(blockNumber, currentPage, pageSize) {
  try {
    let chain = (typeof window) !== 'undefined' && localStorage.getItem('chainType')
    const response = 
    chain == 'EVM Chain' ?
      await fetch(
        `${EXPLORER_API_URL}transactions/get-transaction-by-block?value=${blockNumber}&page=${currentPage}&limit=${pageSize}`
      )
       : await fetch(
        `${NATIVE_EXPLORER_API_URL}transactions/block?value=${blockNumber}&page=${currentPage}&limit=${pageSize}`
      )
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
