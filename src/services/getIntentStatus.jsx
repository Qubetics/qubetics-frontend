import { CHAIN_ABSTRACTION_INTENTLIST_API_URL } from "@/constant/constant";

export default async function getIntentStatus(intentHash) {
try {
    const response = await fetch(
        `${CHAIN_ABSTRACTION_INTENTLIST_API_URL}/routes/intent-list?intentHash=${intentHash}`
    );
    const result = await response.json();

    return result;
} catch (error) {
    console.error('Error fetching intent status', error)

    return null;
}
}
