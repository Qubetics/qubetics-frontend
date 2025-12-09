// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
}));

import getTokenHolders from "../getTokenHolders";
const mockConstants = require("@/constant/constant");

describe("getTokenHolders", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch token holders successfully", async () => {
    const mockResponse = { holders: [{ address: "0xabc", balance: 100 }] };
    const hash = "0x123";

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTokenHolders(1, 10, hash);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}tokens/holders?page=1&limit=10&contractAddress=${hash}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error if response is not ok", async () => {
    const hash = "0x123";

    global.fetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    });

    await expect(getTokenHolders(1, 10, hash)).rejects.toThrow();
  });

  it("should return error if fetch fails", async () => {
    const hash = "0x123";
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    await expect(getTokenHolders(1, 10, hash)).rejects.toThrow("Network Error");
  });
});
