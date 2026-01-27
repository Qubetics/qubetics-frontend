import { OPERATOR_API_URL } from "@/constant/constant";

export default async function getSpecificProviderSearch(value) {
  try {
    const response = await fetch(
      `${OPERATOR_API_URL}/api/v1/provider/search?provAddress=${value}`,
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
