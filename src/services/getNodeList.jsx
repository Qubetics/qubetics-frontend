import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getNodeList(currentPage, tableLimit, reverse) {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}node/all-nodes?page=${currentPage}&limit=${tableLimit}&reverse=${reverse}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
