import { CHAIN_ABSTRACTION_API_URL } from "@/constant/constant";

export default async function getLoadOverTimeChart() {
    try {
        const response = await fetch(
            `${CHAIN_ABSTRACTION_API_URL}/routes/daily-transaction-count`
        )

        const result = await response.json();
        return result;

    } catch (error) {
        console.log("Error while fetching daily-transaction-count", error);
    }
    }
