// Mock constants and react-toastify BEFORE import
jest.mock("@/constant/constant", () => ({
  BUG_REPORT_API: "http://bug-api.test/",
}));

jest.mock("react-toastify", () => ({
  toast: { error: jest.fn() },
}));

import postBugReport from "../postBugReport";
const { BUG_REPORT_API } = require("@/constant/constant");
const { toast } = require("react-toastify");

describe("postBugReport", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should submit bug report successfully", async () => {
    const mockResponse = { ok: true };
    global.fetch.mockResolvedValue(mockResponse);

    const fieldData = {
      name: "John Doe",
      email_address: "john@example.com",
      wallet_address: "0x123",
      description: "Bug description",
      telegram_id: "@john",
      severity: "high",
      additional_comments: "None",
    };
    const selectedApplication = "App1";
    const selectedBugType = "UI";
    const captchaToken = "captcha123";
    const selectedFiles = [new File(["file1"], "file1.txt")];

    const response = await postBugReport(
      fieldData,
      selectedApplication,
      selectedBugType,
      captchaToken,
      selectedFiles
    );

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchArgs = global.fetch.mock.calls[0];
    expect(fetchArgs[0]).toBe(`${BUG_REPORT_API}bug-bounty/submit-bug`);
    expect(fetchArgs[1].method).toBe("POST");
    expect(fetchArgs[1].body).toBeInstanceOf(FormData);
    expect(response).toEqual(mockResponse);
  });

  it("should handle fetch error and call toast.error", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const fieldData = { name: "John Doe", email_address: "", wallet_address: "", description: "", telegram_id: "", severity: "", additional_comments: "" };
    
    const response = await postBugReport(fieldData, "", "", "", []);

    expect(toast.error).toHaveBeenCalledWith(mockError);
    expect(response).toBe(mockError);
  });
});
