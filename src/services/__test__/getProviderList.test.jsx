// Mock the constants BEFORE import
jest.mock("@/constant/constant", () => ({
  OPERATOR_API_URL: "http://operator-api.test",
  tableLimit: 10,
}));

import getProviderList from "../getProviderList";
const mockConstants = require("@/constant/constant");

describe("getProviderList", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch provider list successfully", async () => {
    const mockResponse = { providers: [{ id: 1, name: "Provider 1" }] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getProviderList(2);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.OPERATOR_API_URL}/api/v1/provider?page=2&limit=${mockConstants.tableLimit}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    const result = await getProviderList(1);
    expect(result).toEqual(mockError);
  });
});
