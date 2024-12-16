import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getAllTokens(currentPage, limit) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  const response =
    chain == "EVM Chain"
      ? await fetch(
          `${EXPLORER_API_URL}tokens/all-tokens?page=${currentPage}&limit=${limit}`
        )
      : await fetch(
          `${NATIVE_EXPLORER_API_URL}tokens/all-tokens?page=${currentPage}&limit=${limit}`
        );
  let result = await response.json();
  return result;
}
