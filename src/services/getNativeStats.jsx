import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

const getNativeStats = async () => {
    const response = await fetch(`${NATIVE_EXPLORER_API_URL}explorer/dashboard`)
    const result = await response.json();
    return result;
}

export default getNativeStats;
