// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  OPERATOR_API_URL: "http://operator-api.test",
}));

import getProvidersDetail from "../getProvidersDetail";
const mockConstants = require("@/constant/constant");

describe("getProvidersDetail", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch provider details successfully", async () => {
    const mockResponse = { id: 1, name: "Provider 1" };
    const address = "0xabc123";

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getProvidersDetail(2, 10, address);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.OPERATOR_API_URL}/api/v1/provider/detail/${address}?page=2&limit=10`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    const address = "0xabc123";

    global.fetch.mockRejectedValue(mockError);

    const result = await getProvidersDetail(1, 5, address);
    expect(result).toEqual(mockError);
  });
});
