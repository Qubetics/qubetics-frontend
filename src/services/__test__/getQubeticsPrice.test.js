// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://explorer-api.test",
}));

import getQubeticsPrice from "../getQubeticsPrice";
const mockConstants = require("@/constant/constant");

describe("getQubeticsPrice", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch Qubetics price successfully", async () => {
    const mockResponse = { price: 123.45 };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQubeticsPrice();

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}/explorer/current-token-price`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    await expect(getQubeticsPrice()).rejects.toThrow("Network Error");
  });
});
