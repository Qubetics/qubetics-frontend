// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  CHAIN_ABSTRACTION_API_URL: "http://chain-abstraction.test/",
}));

import GetTransactionOverview from "../getTransactionOverview";
const mockConstants = require("@/constant/constant");

describe("GetTransactionOverview", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch transaction overview successfully", async () => {
    const intentHash = "0xabc123";
    const mockResponse = { data: "transaction overview" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await GetTransactionOverview(intentHash);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.CHAIN_ABSTRACTION_API_URL}/routes/intent-list?intent-hash=${intentHash}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const intentHash = "0xerror";
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    const result = await GetTransactionOverview(intentHash);

    expect(result).toBe(mockError);
  });
});
