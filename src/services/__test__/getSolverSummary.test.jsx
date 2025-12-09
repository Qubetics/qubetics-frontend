// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  SOLVER_API_URL: "http://solver-api.test/",
}));

import GetSolverSummary from "../getSolverSummary";
const mockConstants = require("@/constant/constant");

describe("GetSolverSummary", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch solver summary successfully", async () => {
    const mockResponse = { totalSolvers: 10, activeSolvers: 5 };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await GetSolverSummary();

    expect(global.fetch).toHaveBeenCalledWith(`${mockConstants.SOLVER_API_URL}stats`);
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await GetSolverSummary();

    expect(result).toEqual(mockError);
  });
});
