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

import getStatistics from "../getStatistics";
const mockConstants = require("@/constant/constant");

describe("getStatistics", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should call EVM API when chainType = 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockResponse = { data: "evm stats" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getStatistics();

    expect(global.fetch).toHaveBeenCalledWith(`${mockConstants.EXPLORER_API_URL}explorer/dashboard`);
    expect(result).toEqual(mockResponse);
  });

  it("should call Native API when chainType != 'EVM Chain'", async () => {
    global.localStorage.getItem.mockReturnValue("Native Chain");

    const mockResponse = { data: "native stats" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getStatistics();

    expect(global.fetch).toHaveBeenCalledWith(`${mockConstants.NATIVE_EXPLORER_API_URL}explorer/dashboard`);
    expect(result).toEqual(mockResponse);
  });

  it("should call EVM API if chainType is null", async () => {
    global.localStorage.getItem.mockReturnValue(null);

    const mockResponse = { data: "evm fallback" };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getStatistics();

    expect(global.fetch).toHaveBeenCalledWith(`${mockConstants.EXPLORER_API_URL}explorer/dashboard`);
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    global.localStorage.getItem.mockReturnValue("EVM Chain");

    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await getStatistics();
    expect(result).toEqual(mockError);
  });
});
