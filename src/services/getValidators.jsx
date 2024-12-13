import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getValidators(currentPage, limit) {
  const response = await fetch(
    `${EXPLORER_API_URL}validators/getAllValidators?page=${currentPage}&limit=${limit}`
  );
  let result = await response.json();
  return result;
}
