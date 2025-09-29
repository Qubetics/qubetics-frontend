import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getInternalTxns(
  currentPage,
  tableLimit,
  hash,
  tab
) {
  try {
    const response = await fetch(
      `${EXPLORER_API_URL}contracts/get-internal-tx?page=${currentPage}&limit=${tableLimit}&contractAddress=${hash}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
export  async function getInternalTxnsByHash(
  currentPage,
  tableLimit,
  hash,
  tab
) {
  try {
    const response = await fetch(
      `${EXPLORER_API_URL}transactions/internal/${hash}?page=${currentPage}&limit=${tableLimit}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
