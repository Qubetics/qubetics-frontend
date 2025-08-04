import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getAccounts = async (currentPage, tableLimit, order) => {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}dvpn/accounts?page=${currentPage}&limit=${tableLimit}&orderBy=${order}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};
