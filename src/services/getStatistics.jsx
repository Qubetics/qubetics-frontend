import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getStatistics() {
  try {
    const response = await fetch(`${EXPLORER_API_URL}explorer/dashboard`);
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
