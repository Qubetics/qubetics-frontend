import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getBlocks(currentPage, limit) {
  try {
    let chain =
      typeof window !== "undefined" && localStorage.getItem("chainType");
    const response =
      chain == "EVM Chain"
        ? await fetch(
            `${EXPLORER_API_URL}blocks/get-all-blocks?page=${currentPage}&limit=${limit}`
          )
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}blocks?page=${currentPage}&limit=${limit}`
          );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
