import getAccounts from "../getAccounts";
import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

global.fetch = jest.fn();

describe("getAccounts()", () => {
  const mockUrl = `${NATIVE_EXPLORER_API_URL}dvpn/accounts?page=1&limit=10&orderBy=asc`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call fetch with correct URL and return JSON response", async () => {
    const mockData = { success: true, data: [{ id: 1 }] };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockData),
    });

    const result = await getAccounts(1, 10, "asc");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(mockUrl);
    expect(result).toEqual(mockData);
  });

  it("should return error when fetch throws error", async () => {
    const mockError = new Error("Network Error");
    fetch.mockRejectedValueOnce(mockError);

    const result = await getAccounts(1, 10, "asc");

    expect(result).toBe(mockError);
  });
});
