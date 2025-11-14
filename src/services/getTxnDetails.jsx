import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getTxnDetails(value) {
  const response = await fetch(
    `${EXPLORER_API_URL}explorer/searching?value=${value}`
  );
  let result = await response.json();
  return result;
}
