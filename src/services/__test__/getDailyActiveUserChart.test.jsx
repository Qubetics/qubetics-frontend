// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  CHAIN_ABSTRACTION_API_URL: "http://chain-abs.test",
}));

import getDailyActiveUserChart from "../getDailyActiveUserChart";
const mockConstants = require("@/constant/constant");

describe("getDailyActiveUserChart", () => {

  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should call API and return response JSON", async () => {
    const mockResponse = { data: "daily users" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getDailyActiveUserChart();

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.CHAIN_ABSTRACTION_API_URL}/routes/daily-active-users`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockErr = new Error("Network Error");
    global.fetch.mockRejectedValue(mockErr);

    const result = await getDailyActiveUserChart();

    expect(result).toBe(mockErr);
  });
});
