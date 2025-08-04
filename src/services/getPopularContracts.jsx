import { EXPLORER_API_URL } from "@/constant/constant";

export const getPopularContracts = async () => {
  const response = await fetch(
    `${EXPLORER_API_URL}contracts/popular?page=1&limit=6`
  );
  if (!response.ok) {
    throw new Error();
  }
  let result = await response.json();
  return result;
};
