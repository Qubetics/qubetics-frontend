import { CHAIN_ABSTRACTION_API_URL } from "@/constant/constant";

export default async function GetTransactionOverview(intentHash) {
  try {
    const response = await fetch(
      `${CHAIN_ABSTRACTION_API_URL}/routes/intent-list?intentHash=${intentHash}`
    );

    const result = await response.json();
    return result;

  } catch (error) {
    console.error("Error fetching transaction overview:", error.message);
    return { error: error.message || "Somthing went wrong" };
  }
}
