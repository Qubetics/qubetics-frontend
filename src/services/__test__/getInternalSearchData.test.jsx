// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
}));

import getInternalSearch from "../getInternalSearchData";
const mockConstants = require("@/constant/constant");

describe("getInternalSearch", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should call API with order param when order is provided", async () => {
    const mockResponse = { data: "search result with order" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getInternalSearch(1, 10, "testSearch", "asc");

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}contracts/search/testSearch?page=1&limit=10&order=asc`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call API without order param when order is empty", async () => {
    const mockResponse = { data: "search result no order" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getInternalSearch(2, 20, "example", "");

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}contracts/search/example?page=2&limit=20`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getInternalSearch(1, 10, "failTest", "asc");
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
