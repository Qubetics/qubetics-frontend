import {
  EXPLORER_API_URL,
  NATIVE_EXPLORER_API_URL,
  tableLimit,
} from "@/constant/constant";

export const tokenTransaction = async (address, pageNo) => {
  try {
    let chain =
      typeof window !== "undefined" && localStorage.getItem("chainType");
    const response =
      chain === "EVM Chain"
        ? await fetch(
            `${EXPLORER_API_URL}qubetics/transactions/dvpn/address?address=${address}&page=${pageNo}&limit=${tableLimit}`
          )
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}qubetics/transactions/dvpn/address?address=${address}&page=${pageNo}&limit=${tableLimit}`
          );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching token transactions:", error);
    throw error;
  }
};
