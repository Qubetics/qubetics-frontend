// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

import getNodeSummary from "../getNodeSummary";
const mockConstants = require("@/constant/constant");

describe("getNodeSummary", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch node summary successfully", async () => {
    const mockResponse = {
      totalNodes: 10,
      activeNodes: 8,
      inactiveNodes: 2,
    };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getNodeSummary();

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}node/nodes-summary`
    );

    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getNodeSummary();
    expect(result).toEqual(mockError);
  });
});
