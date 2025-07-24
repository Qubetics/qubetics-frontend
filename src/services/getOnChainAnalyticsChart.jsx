import { CHAIN_ABSTRACTION_API_URL } from "@/constant/constant";

export default async function getOnChainAnalyticsChart() {
try {
    const response  = await fetch(
        `${CHAIN_ABSTRACTION_API_URL}/routes/onchain-analytics`
    ) 

    const result = await response.json();
    return result;

} catch (error) {
    return { error: error.message || "somthing went wrong" };
}
}
