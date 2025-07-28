import { CHAIN_ABSTRACTION_API_URL } from "@/constant/constant";

export default async function GetChainAbstractionTransaction(
  currentPage,
  limit
) {
  try {
    const response = await fetch(
      `${CHAIN_ABSTRACTION_API_URL}/routes/intent-list?page=${currentPage}&limit=${limit}`
    );

    const result = await response.json();
    return result;

  } catch (error) {
    return error;
  }
}
