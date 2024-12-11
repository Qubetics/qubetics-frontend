import { EXPLORER_CONTRACT_VERIFY_URL } from "@/constant/constant";

export default async function getAbiData(address) {
    try {
        const response = await fetch(
            `${EXPLORER_CONTRACT_VERIFY_URL}abi/${address}`
        );
        let result = await response.json();
        return result;
    } catch (error) {
        return error;
    }
}
