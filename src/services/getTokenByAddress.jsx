import {
  EXPLORER_API_URL,
  NATIVE_EXPLORER_API_URL,
  tableLimit,
} from "@/constant/constant";

export default async function getTokenByAddress(address, pageNo) {
  try {
    let chain =
      typeof window !== "undefined" && localStorage.getItem("chainType");
    const response =
      // chain == "EVM Chain"
      //   ? 
        await fetch(
            `${EXPLORER_API_URL}tokens/token-by-wallet-address?address=${address}&page=${pageNo}&limit=${tableLimit}`
          )
        // : await fetch(
        //     `${NATIVE_EXPLORER_API_URL}tokens/token-by-wallet-address?address=${address}&page=${pageNo}&limit=${tableLimit}`
        //   );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
