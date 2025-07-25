import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getNodeSummary() {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}node/nodes-summary`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
