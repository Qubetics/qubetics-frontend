import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getSearchingValue = async (value) => {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  const response =
    chain == "EVM Chain"
      ? await fetch(
          `${EXPLORER_API_URL}explorer/search-active-results?page=1&limit=10&searchedWord=${value}`
        )
      : await fetch(
          `${NATIVE_EXPLORER_API_URL}explorer/searching?value=${value}`
        );
  let result = await response.json();
  return result;
};
