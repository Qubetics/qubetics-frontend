// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
  tableLimit: 10,
}));

import tokenTransaction from "../tokenTransaction";
const { NATIVE_EXPLORER_API_URL, tableLimit } = require("@/constant/constant");

describe("tokenTransaction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("should fetch token transactions successfully", async () => {
    const mockResponse = { data: "transactions" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const address = "0xabc123";
    const pageNo = 2;
    const result = await tokenTransaction(address, pageNo);

    expect(global.fetch).toHaveBeenCalledWith(
      `${NATIVE_EXPLORER_API_URL}transactions/dvpn/address?address=${address}&page=${pageNo}&limit=${tableLimit}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await tokenTransaction("0xabc123", 1);
    expect(result).toBe(mockError);
  });
});
