// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_CONTRACT_VERIFY_URL: "http://contract-api.test/",
}));

import postContractVerificationIcon from "../postContractVerifictaionIcon";
const { EXPLORER_CONTRACT_VERIFY_URL } = require("@/constant/constant");

describe("postContractVerificationIcon", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should post data and return result", async () => {
    const mockData = { contract: "0x123", iconUrl: "http://icon.url" };
    const mockResponse = { success: true };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await postContractVerificationIcon(mockData);

    expect(global.fetch).toHaveBeenCalledWith(
      `${EXPLORER_CONTRACT_VERIFY_URL}uploadIcon`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockData),
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should handle fetch error and return error object", async () => {
    const mockData = { contract: "0x123", iconUrl: "http://icon.url" };
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);
    console.error = jest.fn(); // mock console.error

    const result = await postContractVerificationIcon(mockData);

    expect(console.error).toHaveBeenCalledWith("Error:", mockError);
    expect(result).toEqual({ error: "An error occurred during the request." });
  });
});
