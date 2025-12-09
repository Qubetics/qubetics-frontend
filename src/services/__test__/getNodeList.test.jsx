// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

import getNodeList from "../getNodeList";
const mockConstants = require("@/constant/constant");

describe("getNodeList", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch node list successfully", async () => {
    const mockResponse = {
      nodes: [
        { id: 1, name: "Node 1" },
        { id: 2, name: "Node 2" },
      ],
    };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getNodeList(1, 10, true);

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}node/all-nodes?page=1&limit=10&reverse=true`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getNodeList(1, 10, false);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
