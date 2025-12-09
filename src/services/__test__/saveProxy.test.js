// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_CONTRACT_VERIFY_URL: "http://contract-verify.test/",
}));

import saveProxy from "../saveProxy";
const { EXPLORER_CONTRACT_VERIFY_URL } = require("@/constant/constant");

describe("saveProxy", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should call API and return result", async () => {
    const mockResponse = { success: true };
    const contractAddress = "0xabc123";

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await saveProxy(contractAddress);

    expect(global.fetch).toHaveBeenCalledWith(
      `${EXPLORER_CONTRACT_VERIFY_URL}saveProxyContract?contractAddress=${contractAddress}`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    const contractAddress = "0xabc123";

    global.fetch.mockRejectedValue(mockError);

    const result = await saveProxy(contractAddress);

    expect(result).toBe(mockError);
  });
});
