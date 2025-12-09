// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_API_URL: "http://evm-api.test/",
}));

import getTopValidator from "../getTopValidator";
const mockConstants = require("@/constant/constant");

describe("getTopValidator", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should fetch top validators successfully", async () => {
    const mockResponse = { validators: [{ address: "0xabc", stake: 1000 }] };

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getTopValidator();

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConstants.EXPLORER_API_URL}explorer/top-validator`
    );
    expect(result).toEqual(mockResponse);
  });

  it("should return error if fetch fails", async () => {
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    const result = await getTopValidator();

    expect(result).toBe(mockError);
  });
});
