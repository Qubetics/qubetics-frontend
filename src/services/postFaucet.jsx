import { EXPLORER_API_URL } from "@/constant/constant";

export default async function postFaucet(request_data) {
  try {
    const response = await fetch(`${EXPLORER_API_URL}faucet/transfer`, {
      method: "POST",
      body: JSON.stringify(request_data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let result = await response.json();
    return result;
  } catch (e) {
    return e;
  }
}
