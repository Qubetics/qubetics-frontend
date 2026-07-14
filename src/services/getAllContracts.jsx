import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getAllContracts(currentPage, limit, order, filter) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  const baseUrl =
    filter || chain == "EVM Chain" ? EXPLORER_API_URL : NATIVE_EXPLORER_API_URL;
  const response = await fetch(
    `${baseUrl}contracts/all-contracts?page=${currentPage}&limit=${limit}${
      order !== "" ? `&order=${order}` : ""
    }${filter ? `&filter=${filter}` : ""}`,
  );

  let result = await response.json();

  return result;
}
