/**
 * @jest-environment jsdom
 */

import getActiveUsers from "../getActiveUsers"; 
import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";

global.fetch = jest.fn();

describe("getActiveUsers", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should call correct API and return data (success case)", async () => {
    const mockResponse = { data: ["user1", "user2"] };

    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getActiveUsers(1, 10, true);

    expect(fetch).toHaveBeenCalledWith(
      `${NATIVE_EXPLORER_API_URL}dvpn/accounts/active-users?page=1&limit=10&reverse=true`
    );

    expect(result).toEqual(mockResponse);
  });

  it("should return error (catch block)", async () => {
    const mockError = new Error("Network error");
    fetch.mockRejectedValue(mockError);

    const result = await getActiveUsers(1, 10, false);

    expect(result).toBe(mockError);
  });
});
