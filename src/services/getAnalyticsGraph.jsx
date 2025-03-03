import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getAnalyticsGraph(address) {
  const response = await fetch(`${EXPLORER_API_URL}contracts/graph/${address}`);

  let result = await response.json();
  return result;
}
