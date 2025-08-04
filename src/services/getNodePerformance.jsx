import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export const getNodePerformanceData = async () => {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}node/nodes-performance`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
