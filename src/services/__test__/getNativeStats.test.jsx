// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

import getNativeStats from "../getNativeStats";
const mockConstants = require("@/constant/constant");

describe("getNativeStats", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch native stats successfully", async () => {
    const mockResponse = { totalUsers: 100, activeNodes: 5 };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getNativeStats();

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}explorer/dashboard`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getNativeStats();
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
