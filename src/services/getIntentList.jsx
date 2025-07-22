import { CHAIN_ABSTRACTION_INTENTLIST_API_URL } from "@/constant/constant";

export default async function GetIntentList(currentPage, limit) {
try {
  const response = await fetch(
    `${CHAIN_ABSTRACTION_INTENTLIST_API_URL}/routes/intent-list?page=${currentPage}&limit=${limit}`
  );
  const result = await response.json();

  return result;
} catch (error) {
  return error;
}
}
