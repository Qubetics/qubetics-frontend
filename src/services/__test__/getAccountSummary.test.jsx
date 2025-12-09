import getAccountSummary from "@/services/getAccountSummary";
import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";

// Mock fetch globally
global.fetch = jest.fn();

describe("getAccountSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn();
  });

  test("should call EVM API when chainType is 'EVM Chain'", async () => {
    Storage.prototype.getItem.mockReturnValue("EVM Chain");

    const mockResponse = { total: 10 };
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getAccountSummary();

    expect(fetch).toHaveBeenCalledWith(
      `${EXPLORER_API_URL}dvpn/account-summary`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should call Native API when chainType is NOT 'EVM Chain'", async () => {
    Storage.prototype.getItem.mockReturnValue("Native Chain");

    const mockResponse = { total: 5 };
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getAccountSummary();

    expect(fetch).toHaveBeenCalledWith(
      `${NATIVE_EXPLORER_API_URL}dvpn/account-summary`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should default to EVM Chain when chainType is null", async () => {
    Storage.prototype.getItem.mockReturnValue(null);

    const mockResponse = { total: 15 };
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getAccountSummary();

    expect(fetch).toHaveBeenCalledWith(
      `${EXPLORER_API_URL}dvpn/account-summary`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch fails", async () => {
    const mockError = new Error("Network error");
    fetch.mockRejectedValue(mockError);

    const result = await getAccountSummary();

    expect(result).toBe(mockError);
  });
});
