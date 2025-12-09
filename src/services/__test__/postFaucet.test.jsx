jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://explorer-api.test/",
}));

import postFaucet from "../postFaucet";
const { EXPLORER_API_URL } = require("@/constant/constant");

describe("postFaucet", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  const mockRequestData = {
    address: "0x123",
    amount: 100,
  };

  it("should post faucet request and return result", async () => {
    const mockResponse = { success: true };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await postFaucet(mockRequestData);

    expect(global.fetch).toHaveBeenCalledWith(
      `${EXPLORER_API_URL}faucet/transfer`,
      {
        method: "POST",
        body: JSON.stringify(mockRequestData),
        headers: { "Content-Type": "application/json" },
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await postFaucet(mockRequestData);

    expect(result).toBe(mockError);
  });
});
