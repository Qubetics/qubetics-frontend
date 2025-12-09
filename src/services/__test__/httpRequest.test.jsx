import httpRequest from "../httpRequest";

describe("httpRequest", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  it("should make a GET request and return response data", async () => {
    const mockResponse = { success: true };
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const url = "http://test-api.com/data";
    const result = await httpRequest(url, "GET");

    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: null,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should make a POST request with body and return response data", async () => {
    const mockResponse = { success: true };
    const body = JSON.stringify({ key: "value" });
    global.fetch.mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    const url = "http://test-api.com/data";
    const result = await httpRequest(url, "POST", body);

    expect(global.fetch).toHaveBeenCalledWith(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    expect(result).toEqual(mockResponse);
  });

  it("should return error when fetch fails", async () => {
    const mockError = new Error("Network Error");
    global.fetch.mockRejectedValue(mockError);

    const url = "http://test-api.com/data";
    const result = await httpRequest(url, "GET");

    expect(result).toBe(mockError);
  });
});
