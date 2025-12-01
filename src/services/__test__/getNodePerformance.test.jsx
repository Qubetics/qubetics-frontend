// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

import getNodePerformanceData from "../getNodePerformance";
const mockConstants = require("@/constant/constant");

describe("getNodePerformanceData", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch node performance data successfully", async () => {
    const mockResponse = {
      performance: [
        { nodeId: 1, cpu: 50, memory: 70 },
        { nodeId: 2, cpu: 30, memory: 60 },
      ],
    };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getNodePerformanceData();

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}node/nodes-performance`
    );

    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getNodePerformanceData();
    expect(result).toEqual(mockError);
  });
});
