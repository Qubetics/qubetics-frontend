import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getNodeDetails = async (address, currentPage, tableLimit) => {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}node?address=${address}&page=${currentPage}&limit=${tableLimit}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
