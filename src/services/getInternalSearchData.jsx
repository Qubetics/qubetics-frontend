import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getInternalSearch(
  currentPage,
  tableLimit,
  serachText
) {
  try {
    const response = await fetch(
      `${EXPLORER_API_URL}contracts/search/${serachText}?page=${currentPage}&limit=${tableLimit}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
