import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getSyncData() {
  try {
    const response = await fetch(`${EXPLORER_API_URL}blocks/state-sync`);
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
