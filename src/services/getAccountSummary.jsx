import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getAccountSummary = async () => {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}dvpn/account-summary`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching account summary:", error);
    throw error;
  }
};
