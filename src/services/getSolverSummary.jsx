import { SOLVER_API_URL } from "@/constant/constant";

export default async function GetSolverSummary() {
  try {
    const response = await fetch(`${SOLVER_API_URL}stats`);

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
