import { CHAIN_ABSTRACTION_API_URL } from "@/constant/constant";

export default async function getChainAbstractionSearch(value) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  if (chain == "EVM Chain") return;
  const response = await fetch(
    `${CHAIN_ABSTRACTION_API_URL}/routes/intent-list?search=${value}`
  );
  let result = await response.json();
  return result;
}
