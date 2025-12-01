// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  CHAIN_ABSTRACTION_API_URL: "http://chain-abstraction.test/",
}));

import getLoadOverTimeChart from "../getLoadOverTimeChart";
const mockConstants = require("@/constant/constant");

describe("getLoadOverTimeChart", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch daily transaction count chart data", async () => {
    const mockResponse = { data: "daily transactions" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getLoadOverTimeChart();

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.CHAIN_ABSTRACTION_API_URL}/routes/daily-transaction-count`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getLoadOverTimeChart();
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
