// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
  NATIVE_EXPLORER_API_URL: "http://native-api.test/",
}));

// Mock localStorage globally BEFORE import
Object.defineProperty(global, "localStorage", {
  value: {
    getItem: jest.fn(),
  },
  writable: true,
});

import getValidators from "../getValidators";
const mockConstants = require("@/constant/constant");

describe("getValidators", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should call EVM API when chainType is 'EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");
    const mockResponse = { data: "evm validators" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getValidators(1, 10);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}validators/getAllValidators?page=1&limit=10`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should call Native API when chainType is not 'EVM Chain'", async () => {
    global.localStorage.getItem = jest.fn(() => "Native Chain");
    const mockResponse = { data: "native validators" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getValidators(2, 20);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.NATIVE_EXPLORER_API_URL}validators?page=2&limit=20`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should fallback to EVM API when chainType is null", async () => {
    global.localStorage.getItem = jest.fn(() => null);
    const mockResponse = { data: "fallback evm validators" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getValidators(3, 5);

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}validators/getAllValidators?page=3&limit=5`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch throws", async () => {
    global.localStorage.getItem = jest.fn(() => "EVM Chain");
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    await expect(getValidators(1, 10)).rejects.toThrow("Network Error");
  });
});
