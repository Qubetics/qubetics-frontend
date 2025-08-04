import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getMessages = async (txnHash) => {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}session/all-message?txHash=${txnHash}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
