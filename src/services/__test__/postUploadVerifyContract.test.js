// Mock constants BEFORE import
jest.mock("@/constant/constant", () => ({
  EXPLORER_CONTRACT_VERIFY_URL: "http://contract-verify.test/",
}));

// Mock toast
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));

import postUploadVerifyContract from "../postUploadVerifyContract";
const { EXPLORER_CONTRACT_VERIFY_URL } = require("@/constant/constant");
const { toast } = require("react-toastify");

describe("postUploadVerifyContract", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  const mockFormData = {
    compilerType: "solidity",
    compilerVersion: "0.8.18",
    licenseType: "1",
  };

  const mockFiles = [
    { originFileObj: new Blob(["file content"], { type: "text/plain" }) },
  ];

  it("should upload contract and return response", async () => {
    const mockResponse = { success: true };
    const checkAddress = "0xabc123";
    const runsCheck = true;
    const runsOptimizer = 200;
    const EVMVersion = "istanbul";
    const abiCode = "[]";

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await postUploadVerifyContract(
      checkAddress,
      mockFormData,
      mockFiles,
      runsCheck,
      runsOptimizer,
      EVMVersion,
      abiCode
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${EXPLORER_CONTRACT_VERIFY_URL}verify`,
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );

    expect(result).toEqual(mockResponse);
  });

  it("should return error and call toast on fetch failure", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const result = await postUploadVerifyContract(
      "0xabc123",
      mockFormData,
      mockFiles,
      true,
      200,
      "istanbul",
      "[]"
    );

    expect(toast.error).toHaveBeenCalledWith(mockError);
    expect(result).toBe(mockError);
  });
});
