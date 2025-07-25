import { CHAIN_ABSTRACTION_API_URL } from "@/constant/constant";

export default async function getDailyActiveUserChart() {
  try {
    const response = await fetch(
      `${CHAIN_ABSTRACTION_API_URL}/routes/daily-active-users`
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
