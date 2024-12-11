import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getTransactionDetail(hash) {
  try {
    const response = await fetch(
      `${EXPLORER_API_URL}transactions/get-transaction-by-hash/${hash}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
