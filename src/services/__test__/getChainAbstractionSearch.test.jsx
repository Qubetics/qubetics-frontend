// Mock constants BEFORE importing the module
jest.mock("@/constant/constant", () => ({
  CHAIN_ABSTRACTION_API_URL: "http://chain-abs.test",
}));

// Mock localStorage globally
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(),
  },
  writable: true,
});

// Import function AFTER mocks
import getChainAbstractionSearch from "../getChainAbstractionSearch";

describe("getChainAbstractionSearch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  test("should NOT call API when chainType is 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");

    const result = await getChainAbstractionSearch("hello");

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  test("should call API when chainType is NOT 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("Native Chain");

    const mockResponse = { data: "chain abstraction result" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getChainAbstractionSearch("vpn");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://chain-abs.test/routes/intent-list?search=vpn"
    );
    expect(result).toEqual(mockResponse);
  });

  test("should treat null chainType as Native and call API", async () => {
    global.localStorage.getItem.mockReturnValue(null);

    const mockResponse = { data: "fallback result" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getChainAbstractionSearch("dvpn");

    expect(global.fetch).toHaveBeenCalledWith(
      "http://chain-abs.test/routes/intent-list?search=dvpn"
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error if fetch throws", async () => {
    global.localStorage.getItem.mockReturnValue("Native Chain");

    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    try {
      await getChainAbstractionSearch("abc");
      fail("should have thrown an error");
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
