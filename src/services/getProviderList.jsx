import {
  OPERATOR_API_URL,
  tableLimit,
} from "@/constant/constant";

export default async function getProviderList( page) {
  try {
    const response = await fetch(
      `${OPERATOR_API_URL}/api/v1/provider?page=${page}&limit=${tableLimit}`
    );
    let result = await response.json();

    return result;
  } catch (error) {
    return error;
  }
}
