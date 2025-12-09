// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test",
}));

import getBlockTime from "../getBlockTime";

describe("getBlockTime", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch block time successfully", async () => {
    const mockResponse = { time: 5000 };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getBlockTime();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://evm-api.test/blocks/block-time"
    );

    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getBlockTime();

    expect(result).toBe(mockError);
  });
});
