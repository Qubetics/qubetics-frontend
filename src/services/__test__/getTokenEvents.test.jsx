// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
}));

import getTokenEvents from "../getTokenEvents";
const mockConstants = require("@/constant/constant");

describe("getTokenEvents", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch token events successfully", async () => {
    const mockResponse = { events: ["event1", "event2"] };
    const hash = "0xabc123";

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTokenEvents(1, 10, hash);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}contracts/events?page=1&limit=10&contractAddress=${hash}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    const hash = "0xabc123";

    global.fetch.mockRejectedValue(mockError);

    await expect(getTokenEvents(1, 10, hash)).rejects.toThrow("Network Error");
  });
});
