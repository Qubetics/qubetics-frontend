import { EXPLORER_API_URL } from "@/constant/constant";

export const getTopValidator = async () => {
  try {
    const response = await fetch(`${EXPLORER_API_URL}explorer/top-validator`);
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
