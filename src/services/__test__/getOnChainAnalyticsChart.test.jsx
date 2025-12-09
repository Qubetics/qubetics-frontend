// Mock the constant BEFORE import
jest.mock("@/constant/constant", () => ({
  CHAIN_ABSTRACTION_API_URL: "http://chain-abstraction-api.test/",
}));

import getOnChainAnalyticsChart from "../getOnChainAnalyticsChart";
const mockConstants = require("@/constant/constant");

describe("getOnChainAnalyticsChart", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch on-chain analytics chart successfully", async () => {
    const mockResponse = { totalTransactions: 100, activeAccounts: 50 };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getOnChainAnalyticsChart();

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.CHAIN_ABSTRACTION_API_URL}/routes/onchain-analytics`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    const result = await getOnChainAnalyticsChart();
    expect(result).toEqual(mockError);
  });
});
