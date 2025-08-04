import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getNodeDetailSummary = async (address) => {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}/node/node-detail-summary?address=${address}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
