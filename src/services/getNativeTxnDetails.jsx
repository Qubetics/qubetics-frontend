import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getNativeTxnDetails(value) {
  const response = await fetch(
    `${NATIVE_EXPLORER_API_URL}explorer/searching?value=${value}`
  );
  let result = await response.json();
  return result;
}

