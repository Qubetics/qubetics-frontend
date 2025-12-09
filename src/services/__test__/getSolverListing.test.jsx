// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  SOLVER_API_URL: "http://solver-api.test/",
}));

import GetSolverListing from "../getSolverListing";
const mockConstants = require("@/constant/constant");

describe("GetSolverListing", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch solver listing with status", async () => {
    const mockResponse = { data: ["solver1", "solver2"] };
    const currentPage = 1;
    const limit = 10;
    const status = "active";

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await GetSolverListing(currentPage, limit, status);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.SOLVER_API_URL}solver-list?page=1&limit=10&status=active`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should fetch solver listing without status", async () => {
    const mockResponse = { data: ["solver1", "solver2"] };
    const currentPage = 2;
    const limit = 5;

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await GetSolverListing(currentPage, limit);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.SOLVER_API_URL}solver-list?page=2&limit=5`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await GetSolverListing(1, 10, "active");

    expect(result).toEqual(mockError);
  });
});
