import {
  NATIVE_EXPLORER_API_URL,
  NEW_EXPLORER_API_URL,
  NEW_EXPLORER_STATS_URL,
} from "@/constant/constant";

export default async function getStatistics() {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  if (chain === null || chain === undefined) {
    chain = "EVM Chain";
  }
  try {
    const response =
      chain === "EVM Chain"
        ? await fetch(`${NEW_EXPLORER_API_URL}/stats`)
        : await fetch(`${NATIVE_EXPLORER_API_URL}explorer/dashboard`);

    const result = await response.json();

    // Only fetch / parse the qubeStats when the chain is EVM
    if (chain === "EVM Chain") {
      const circulatingSupplyResponse = await fetch(
        `${NEW_EXPLORER_STATS_URL}?module=stats&action=coinsupply`
      );
      const circulatingSupply = await circulatingSupplyResponse.json();

      return { result, circulatingSupply };
    }
    // for native chain just return result
    return { result };
  } catch (error) {
    return error;
  }
}
