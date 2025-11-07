import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getProvidersDetailSummary(address) {
  try {
    const response = await fetch(`${NATIVE_EXPLORER_API_URL}dvpn?address=${address}`);
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
