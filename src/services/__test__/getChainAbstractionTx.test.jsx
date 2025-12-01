// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  CHAIN_ABSTRACTION_API_URL: "http://chain-abs-api.test",
}));

import GetChainAbstractionTransaction from "../getChainAbstractionTx";

const mockConstants = require("@/constant/constant");

describe("GetChainAbstractionTransaction", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch transaction list successfully", async () => {
    const mockResponse = { data: "transaction list" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await GetChainAbstractionTransaction(1, 10);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.CHAIN_ABSTRACTION_API_URL}/routes/intent-list?page=1&limit=10`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    const result = await GetChainAbstractionTransaction(1, 10);

    expect(result).toBe(mockError);
  });
});
