import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getSearchingValue(value) {
  let chain = typeof window !== "undefined" && localStorage.getItem("chainType");

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const queryChain = params.get("chain")?.toLowerCase();
    const storedChain = localStorage.getItem("chainType");

    const newChain =
      queryChain === "native" ? "Native Chain" : queryChain === "evm" ? "EVM Chain" : storedChain || "EVM Chain";

    if (newChain !== storedChain) {
      localStorage.setItem("chainType", newChain);
      window.location.reload();
    }

    chain = newChain;
  }

  const response =
    chain == "EVM Chain"
      ? await fetch(`${EXPLORER_API_URL}explorer/searching?value=${value}`)
      : await fetch(`${NATIVE_EXPLORER_API_URL}explorer/searching?value=${value}`);
  let result = await response.json();
  return result;
}
