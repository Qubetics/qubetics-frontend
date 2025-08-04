import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

/*This api is for getting details of Address detail page (Coin Balance, Stake,Value)*/
export const getAddressDetails = async (address) => {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  try {
    const response =
      chain == "EVM Chain"
        ? await fetch(`${EXPLORER_API_URL}explorer/address-detail/${address}`)
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}explorer/address-detail/${address}`
          );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching address details:", error);
    throw error;
  }
};
