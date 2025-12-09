// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_CONTRACT_VERIFY_URL: "http://contract-api.test/",
}));

// Mock react-toastify
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));

import postContractVerify from "../postContractVerify";
const { EXPLORER_CONTRACT_VERIFY_URL } = require("@/constant/constant");
const { toast } = require("react-toastify");

describe("postContractVerify", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  const mockFormData = {
    compilerType: "solidity",
    compilerVersion: "0.8.20",
    licenseType: "1",
  };

  const mockSolidityCode = "pragma solidity ^0.8.20;";
  const mockAbi = [];
  const contractAddress = "0x123";

  it("should post contract verification data and return result", async () => {
    const mockResponse = { success: true };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await postContractVerify(
      contractAddress,
      mockFormData,
      mockSolidityCode,
      true,
      200,
      "evmVersionX",
      mockAbi
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${EXPLORER_CONTRACT_VERIFY_URL}verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractaddress: contractAddress,
          codeformat: "solidity",
          compilerversion: "0.8.20",
          sourceCode: mockSolidityCode,
          licenseType: 1,
          optimizationUsed: 1,
          runs: 200,
          evmVersion: "evmVersionX",
          abi: mockAbi,
        }),
      }
    );

    expect(result).toEqual(mockResponse);
  });

  it("should handle fetch error and call toast.error", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await postContractVerify(
      contractAddress,
      mockFormData,
      mockSolidityCode,
      true,
      200,
      "evmVersionX",
      mockAbi
    );

    expect(toast.error).toHaveBeenCalledWith(mockError);
    expect(result).toBe(mockError);
  });
});
