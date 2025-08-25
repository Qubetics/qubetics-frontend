import {
  NEW_EXPLORER_API_URL,
  NATIVE_EXPLORER_API_URL,
} from "@/constant/constant";

export default async function getNewSearchingValue(value) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  const response =
    chain == "EVM Chain"
      ? await fetch(`${NEW_EXPLORER_API_URL}/transactions/${value}`)
      : await fetch(
          `${NATIVE_EXPLORER_API_URL}explorer/searching?value=${value}`
        );
  let result = await response.json();
  return result;
}
