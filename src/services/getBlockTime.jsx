import { EXPLORER_API_URL } from "@/constant/constant";
export const getBlockTime = async () => {
  try {
    const response = await fetch(`${EXPLORER_API_URL}/blocks/block-time`);
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
