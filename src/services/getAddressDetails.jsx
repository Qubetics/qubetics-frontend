import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

/*This api is for getting details of Address detail page (Coin Balance, Stake,Value)*/
export default async function getAddressDetails(address) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  try {
    const response =
      chain == "EVM Chain"
        ? await fetch(`${EXPLORER_API_URL}explorer/address-detail/${address}`)
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}explorer/address-detail/${address}`
          );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
