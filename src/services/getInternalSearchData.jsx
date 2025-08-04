import { EXPLORER_API_URL } from "@/constant/constant";

export const getInternalSearch = async (
  currentPage,
  tableLimit,
  serachText,
  order
) => {
  try {
    const response = await fetch(
      `${EXPLORER_API_URL}contracts/search/${serachText}?page=${currentPage}&limit=${tableLimit}${
        order !== "" ? `&order=${order}` : ""
      }`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
