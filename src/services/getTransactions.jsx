import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getTransactions = async (currentPage, limit, filterVal) => {
  try {
    let chain =
      typeof window !== "undefined" && localStorage.getItem("chainType");
    if (chain === null || chain === undefined) {
      chain = "EVM Chain";
    }

    const response =
      chain == "EVM Chain"
        ? await fetch(
            `${EXPLORER_API_URL}transactions/get-all-transactions?page=${currentPage}&limit=${limit}&order=${filterVal}`
          )
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}transactions?page=${currentPage}&limit=${limit}&order=${filterVal}`
          );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
