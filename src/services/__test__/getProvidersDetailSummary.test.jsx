// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

import getProvidersDetailSummary from "../getProvidersDetailSummary";
const mockConstants = require("@/constant/constant");

describe("getProvidersDetailSummary", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch provider summary successfully", async () => {
    const mockResponse = { id: 1, name: "Provider Summary" };
    const address = "0xabc123";

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getProvidersDetailSummary(address);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}dvpn?address=${address}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    const address = "0xabc123";

    global.fetch.mockRejectedValue(mockError);

    const result = await getProvidersDetailSummary(address);

    expect(result).toEqual(mockError);
  });
});
