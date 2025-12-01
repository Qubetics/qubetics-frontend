// Mock the constants BEFORE importing the function
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
}));

import getAnalyticsGraph from "../getAnalyticsGraph";

describe("getAnalyticsGraph", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should call correct API URL and return response json", async () => {
    const mockAddress = "0x12345";

    const mockResponse = { graph: "data" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getAnalyticsGraph(mockAddress);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://evm-api.test/contracts/graph/${mockAddress}`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockAddress = "0xERROR";
    const mockError = new Error("Network failed");

    global.fetch.mockRejectedValue(mockError);

    try {
      await getAnalyticsGraph(mockAddress);
    } catch (err) {
      expect(err).toBe(mockError);
    }
  });
});
