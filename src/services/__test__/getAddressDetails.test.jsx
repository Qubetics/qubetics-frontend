import getAddressDetails from "../getAddressDetails";
import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getAddressDetails", () => {
  test("should fetch EVM chain address details when chainType is 'EVM Chain'", async () => {
    const mockAddress = "abcd1234";

    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockResponse = { data: "evm details" };
    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getAddressDetails(mockAddress);

    expect(fetch).toHaveBeenCalledWith(
      `${EXPLORER_API_URL}explorer/address-detail/${mockAddress}`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should fetch Native chain when chainType is NOT 'EVM Chain'", async () => {
    const mockAddress = "xyz789";

    global.localStorage = {
      getItem: jest.fn(() => "Native Chain"),
    };

    const mockResponse = { data: "native details" };
    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getAddressDetails(mockAddress);

    expect(fetch).toHaveBeenCalledWith(
      `${NATIVE_EXPLORER_API_URL}explorer/address-detail/${mockAddress}`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should fetch Native chain if chainType is null", async () => {
    const mockAddress = "xxx555";

    global.localStorage = {
      getItem: jest.fn(() => null),
    };

    const mockResponse = { data: "native fallback" };
    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getAddressDetails(mockAddress);

    expect(fetch).toHaveBeenCalledWith(
      `${NATIVE_EXPLORER_API_URL}explorer/address-detail/${mockAddress}`
    );

    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockAddress = "error-test";

    global.localStorage = {
      getItem: jest.fn(() => "EVM Chain"),
    };

    const mockError = new Error("Network error");
    fetch.mockRejectedValue(mockError);

    const result = await getAddressDetails(mockAddress);

    expect(result).toBe(mockError);
  });

  test("should handle window undefined gracefully", async () => {
    const mockAddress = "window-test";

    const originalWindow = global.window;
    delete global.window;

    const mockResponse = { data: "fallback data" };
    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getAddressDetails(mockAddress);

    expect(fetch).toHaveBeenCalledWith(
      `${NATIVE_EXPLORER_API_URL}explorer/address-detail/${mockAddress}`
    );

    expect(result).toEqual(mockResponse);

    global.window = originalWindow;
  });
});
