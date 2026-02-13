import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getAccounts(currentPage, tableLimit, order) {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}dvpn/accounts?page=${currentPage}&limit=${tableLimit}&orderBy=${order}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
