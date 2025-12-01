// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_CONTRACT_VERIFY_URL: "http://verify-api.test/",
}));

// Mock localStorage BEFORE module import
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(),
  },
  writable: true,
});

import getContractVerificationDetail from "../getContractVeriicationDetail";
const mockConstants = require("@/constant/constant");

describe("getContractVerificationDetail", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.resetModules();
    jest.clearAllMocks();
  });

  test("should call correct API and return response", async () => {
    const mockResponse = { status: "success", contract: "details" };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getContractVerificationDetail("0xabc123");

    expect(fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_CONTRACT_VERIFY_URL}detail/0xabc123`
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch throws", async () => {
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    const result = await getContractVerificationDetail("0xerror");

    expect(result).toBe(mockError);
  });
});
