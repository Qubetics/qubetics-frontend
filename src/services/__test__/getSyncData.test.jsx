// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
}));

import getSyncData from "../getSyncData";
const mockConstants = require("@/constant/constant");

describe("getSyncData", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch sync data successfully", async () => {
    const mockResponse = { status: "synced" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getSyncData();

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}blocks/state-sync`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getSyncData();

    expect(result).toEqual(mockError);
  });
});
