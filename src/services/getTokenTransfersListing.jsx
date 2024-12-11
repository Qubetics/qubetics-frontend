import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getTokenTransfersListing(currentPage, limit) {
    try {
        const response = await fetch(
            `${EXPLORER_API_URL}transactions/erc-20?page=${currentPage}&limit=${limit}`
        )
        let result = await response.json();
        return result;
    } catch (error) {
        return error;
    }
}
