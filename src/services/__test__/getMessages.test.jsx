// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

import getMessages from "../getMessages";
const mockConstants = require("@/constant/constant");

describe("getMessages", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch messages for a given txnHash", async () => {
    const txnHash = "0xabc123";
    const mockResponse = { messages: ["msg1", "msg2"] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getMessages(txnHash);

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}session/all-message?txHash=${txnHash}`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const txnHash = "0xerror";
    const mockError = new Error("Network error");

    global.fetch.mockRejectedValue(mockError);

    try {
      await getMessages(txnHash);
    } catch (error) {
      expect(error).toBe(mockError);
    }
  });
});
