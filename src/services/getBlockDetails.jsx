import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getBlockDetails = async (blockNumber) => {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}blocks/detail/${blockNumber}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
