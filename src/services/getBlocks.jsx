import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getBlocks = async (currentPage, limit, filterVal, order) => {
  try {
    let chain =
      typeof window !== "undefined" && localStorage.getItem("chainType");
    if (chain === null || chain === undefined) {
      chain = "EVM Chain";
    }
    const response =
      chain == "EVM Chain"
        ? await fetch(
            `${EXPLORER_API_URL}blocks/get-all-blocks?page=${currentPage}&limit=${limit}&order=${order}&filterBy=${filterVal}`
          )
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}blocks?page=${currentPage}&limit=${limit}&order=${order}&filterBy=${filterVal}`
          );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
