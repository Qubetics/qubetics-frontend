import { EXPLORER_CONTRACT_VERIFY_URL } from "@/constant/constant";

export const getAbiData = async (address) => {
  try {
    const response = await fetch(
      `${EXPLORER_CONTRACT_VERIFY_URL}abi/${address}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching ABI data:", error);
    throw error;
  }
};
