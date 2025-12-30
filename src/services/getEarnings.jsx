import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

export default async function getEarnings(address) {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}dvpn/node?address=${address}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
