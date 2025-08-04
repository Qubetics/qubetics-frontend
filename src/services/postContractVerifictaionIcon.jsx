import { EXPLORER_CONTRACT_VERIFY_URL } from "@/constant/constant";

export const postContractVerificationIcon = async (data) => {
  try {
    const response = await fetch(`${EXPLORER_CONTRACT_VERIFY_URL}uploadIcon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    return { error: "An error occurred during the request." };
  }
};
