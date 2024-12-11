import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getTokenHolders(currentPage, limit, hash) {
    let response = await fetch(`${EXPLORER_API_URL}tokens/holders?page=${currentPage}&limit=${limit}&contractAddress=${hash}`)
    if (!response.ok) {
        throw new Error();
    }
    let result = await response.json();
    return result;
}
