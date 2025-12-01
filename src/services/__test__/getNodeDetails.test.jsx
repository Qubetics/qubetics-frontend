// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

import getNodeDetails from "../getNodeDetails";
const mockConstants = require("@/constant/constant");

describe("getNodeDetails", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch node details successfully", async () => {
    const mockResponse = {
      address: "0xabc",
      nodes: [{ id: 1 }, { id: 2 }],
    };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getNodeDetails("0xabc", 1, 10);

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}node?address=0xabc&page=1&limit=10`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getNodeDetails("0xabc", 1, 10);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
