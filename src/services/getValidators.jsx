import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getValidators(currentPage, limit) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  if (chain === null || chain === undefined) {
    chain = "EVM Chain";
  }
  const response =
    chain == "EVM Chain"
      ? await fetch(
          `${EXPLORER_API_URL}validators/getAllValidators?page=${currentPage}&limit=${limit}`
        )
      : await fetch(
          `${NATIVE_EXPLORER_API_URL}validators?page=${currentPage}&limit=${limit}`
        );
  let result = await response.json();
  return result;
}
