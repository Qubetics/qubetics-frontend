// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
  tableLimit: 10,
}));

// Mock localStorage globally BEFORE import
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(),
  },
  writable: true,
});

import getTokenByAddress from "../getTokenByAddress";
const mockConstants = require("@/constant/constant");

describe("getTokenByAddress", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch EVM chain tokens when chainType is 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");
    const mockResponse = { tokens: ["token1", "token2"] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTokenByAddress("0xabc123", 1);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}tokens/token-by-wallet-address?address=0xabc123&page=1&limit=10`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should fetch Native chain tokens when chainType is not 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("Native Chain");
    const mockResponse = { tokens: ["tokenA", "tokenB"] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTokenByAddress("0xdef456", 2);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}tokens/token-by-wallet-address?address=0xdef456&page=2&limit=10`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getTokenByAddress("0xerror", 1);

    expect(result).toEqual(mockError);
  });

  it("should default to Native chain if chainType is null or undefined", async () => {
    global.localStorage.getItem.mockReturnValue(null);
    const mockResponse = { tokens: ["tokenX"] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTokenByAddress("0xnull", 1);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}tokens/token-by-wallet-address?address=0xnull&page=1&limit=10`
    );
    expect(result).toEqual(mockResponse);
  });
});
