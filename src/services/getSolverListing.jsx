import { SOLVER_API_URL } from "@/constant/constant";

export default async function GetSolverListing(currentPage, limit, status) {
  try {
    const response = await fetch(
      `${SOLVER_API_URL}solver-list?page=${currentPage}&limit=${limit}${
        status ? `&status=${status}` : ""
      }`
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
