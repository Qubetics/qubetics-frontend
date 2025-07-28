import { CHAIN_ABSTRACTION_API_URL } from "@/constant/constant";

export default async function GetTransactionOverview(intentHash) {
  try {
    const response = await fetch(
      `${CHAIN_ABSTRACTION_API_URL}/routes/intent-list?intent-hash=${intentHash}`
    );

    const result = await response.json();
    return result;
    
  } catch (error) {
    return error;
  }
}
