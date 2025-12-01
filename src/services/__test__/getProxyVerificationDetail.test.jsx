// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_CONTRACT_VERIFY_URL: "http://contract-verify.test/",
}));

import getProxyVerificationDetail from "../getProxyVerificationDetail";
const mockConstants = require("@/constant/constant");

describe("getProxyVerificationDetail", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch proxy contract verification details successfully", async () => {
    const mockResponse = { verified: true };
    const contractAddress = "0xabc123";

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getProxyVerificationDetail(contractAddress);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_CONTRACT_VERIFY_URL}verifyproxycontract?contractAddress=${contractAddress}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    const contractAddress = "0xabc123";

    global.fetch.mockRejectedValue(mockError);

    const result = await getProxyVerificationDetail(contractAddress);

    expect(result).toEqual(mockError);
  });
});
