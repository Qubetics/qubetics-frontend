import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getAccounts(currentPage, tableLimit, order) {
  try {
    let chain =
      typeof window !== "undefined" && localStorage.getItem("chainType");
    if (chain === null || chain === undefined) {
      chain = "EVM Chain";
    }
    const response =
      chain == "EVM Chain"
        ? await fetch(
            `${EXPLORER_API_URL}dvpn/accounts?page=${currentPage}&limit=${tableLimit}&orderBy=${order}`
          )
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}dvpn/accounts?page=${currentPage}&limit=${tableLimit}&orderBy=${order}`
          );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
