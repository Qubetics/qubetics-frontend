import { EXPLORER_API_URL } from "@/constant/constant";

export const getTokenEvents = async (currentPage, limit, hash) => {
  let response = await fetch(
    `${EXPLORER_API_URL}contracts/events?page=${currentPage}&limit=${limit}&contractAddress=${hash}`
  );
  let result = await response.json();
  return result;
};
