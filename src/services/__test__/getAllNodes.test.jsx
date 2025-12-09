// Mock constants BEFORE importing the function
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
}));

import getNodes from "../getAllNodes";

describe("getNodes", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch nodes successfully", async () => {
    const mockResponse = { peers: ["node1", "node2"] };

    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await getNodes();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://evm-api.test/explorer/peers"
    );

    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockError = new Error("Network error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getNodes();

    expect(result).toBe(mockError);
  });
});
