import { EXPLORER_API_URL } from "@/constant/constant";

const getQubeticsPrice = async () => {
  const response = await fetch(
    `${EXPLORER_API_URL}explorer/current-token-price`
  );
  const result = await response.json();
  return result;
};
export default getQubeticsPrice;
