import getCompilerVersion from "../getCompilerVersion";

describe("getCompilerVersion", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  test("should fetch compiler version list successfully", async () => {
    const mockResponse = { versions: ["0.8.20", "0.8.19"] };

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getCompilerVersion();

    expect(global.fetch).toHaveBeenCalledWith(
      "https://binaries.soliditylang.org/bin/list.json"
    );
    expect(result).toEqual(mockResponse);
  });

  test("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");

    global.fetch.mockRejectedValue(mockError);

    const result = await getCompilerVersion();

    expect(result).toBe(mockError);
  });
});
