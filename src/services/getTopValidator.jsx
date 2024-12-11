import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getTopValidator() {
  try {
    const response = await fetch(`${EXPLORER_API_URL}explorer/top-validator`);
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}

