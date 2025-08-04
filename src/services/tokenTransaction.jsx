import { NATIVE_EXPLORER_API_URL, tableLimit } from "@/constant/constant";

export const tokenTransaction = async (address, pageNo) => {
  try {
    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}transactions/dvpn/address?address=${address}&page=${pageNo}&limit=${tableLimit}`
    );

    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
