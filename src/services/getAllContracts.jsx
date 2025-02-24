import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getAllContracts(currentPage, limit, order) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  const response =
    chain == "EVM Chain"
      ? await fetch(
          `${EXPLORER_API_URL}contracts/all-contracts?page=${currentPage}&limit=${limit}${
            order !== "" ? `&order=${order}` : ""
          }`
        )
      : await fetch(
          `${NATIVE_EXPLORER_API_URL}contracts/all-contracts?page=${currentPage}&limit=${limit}`
        );
  let result = await response.json();
  return result;
}
