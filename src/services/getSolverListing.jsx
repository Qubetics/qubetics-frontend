import { SOLVER_API_URL } from "@/constant/constant";

export default async function GetSolverListing(currentPage, limit) {
  try {
    const response = await fetch(
      `${SOLVER_API_URL}solver-list?page=${currentPage}&limit=${limit}`
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
