import { OPERATOR_API_URL } from "@/constant/constant";

export default async function getProvidersDetail(currentPage, tableLimit, address) {
  try {
    const response = await fetch(
      `${OPERATOR_API_URL}/api/v1/provider/detail/${address}?page=${currentPage}&limit=${tableLimit}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
