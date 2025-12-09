import { chartMenu, chartSeriesValue } from "../chartMenu";
import { generateData } from "@/constant/constant";
import moment from "moment";

jest.mock("@/constant/constant", () => ({
  generateData: jest.fn(),
}));

jest.mock("moment", () => jest.fn());

describe("chartMenu", () => {
  const mockData = [
    { createdAt: "2023-01-01T10:00:00Z", count: 1 },
    { createdAt: "2023-01-01T11:00:00Z", count: 2 },
  ];

  const mockGeneratedData = [
    { createdAt: "2023-01-01T12:00:00Z", count: 0 },
    { createdAt: "2023-01-01T13:00:00Z", count: 0 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    generateData.mockReturnValue(mockGeneratedData);
    moment.mockImplementation((date) => ({
      format: jest.fn((format) => {
        if (format === "hh:mm:ss a") return "10:00:00 am";
        if (format === "hh:mm a") return "10:00 am";
        if (format === "DD MMM ") return "01 Jan ";
        if (format === " MMM YYYY ") return " Jan 2023 ";
        if (format === "DD MMM YYYY") return "01 Jan 2023";
        return "formatted";
      }),
    }));
  });

  describe("when data is provided", () => {
    it("should format labels for TRANS_HISTORY_CHART_SECONDS", () => {
      const result = chartMenu(mockData, "1 Day");
      expect(result).toEqual(["10:00:00 am", "10:00:00 am"]);
      expect(generateData).not.toHaveBeenCalled();
    });

    it("should format labels for ALL_CHARTS_HOUR", () => {
      const result = chartMenu(mockData, "1 Hour");
      expect(result).toEqual(["10:00:00 am", "10:00:00 am"]);
      expect(generateData).not.toHaveBeenCalled();
    });

    it("should format labels for TRANS_HISTORY_CHART_MINUTES", () => {
      const result = chartMenu(mockData, "7 Days");
      expect(result).toEqual(["01 Jan ", "01 Jan "]);
      expect(generateData).not.toHaveBeenCalled();
    });

    it("should format labels for ALL_CHART_THRITY_DAYS", () => {
      const result = chartMenu(mockData, "30 Days");
      expect(result).toEqual(["01 Jan ", "01 Jan "]);
      expect(generateData).not.toHaveBeenCalled();
    });

    it("should format labels for TRANS_HISTORY_CHART_YEAR", () => {
      const result = chartMenu(mockData, "1 Year");
      expect(result).toEqual([" Jan 2023 ", " Jan 2023 "]);
      expect(generateData).not.toHaveBeenCalled();
    });

    it("should format labels for unknown chartType", () => {
      const result = chartMenu(mockData, "unknown");
      expect(result).toEqual(["01 Jan 2023", "01 Jan 2023"]);
      expect(generateData).not.toHaveBeenCalled();
    });
  });

  describe("when data is not provided or empty", () => {
    it("should use generateData for TRANS_HISTORY_CHART_SECONDS", () => {
      const result = chartMenu([], "1 Day");
      expect(generateData).toHaveBeenCalledWith("1 Day");
      expect(result).toEqual(["10:00:00 am", "10:00:00 am"]);
    });

    it("should use generateData for ALL_CHARTS_HOUR", () => {
      const result = chartMenu(null, "1 Hour");
      expect(generateData).toHaveBeenCalledWith("1 Hour");
      expect(result).toEqual(["10:00:00 am", "10:00:00 am"]);
    });

    it("should use generateData for TRANS_HISTORY_CHART_MINUTES", () => {
      const result = chartMenu(undefined, "7 Days");
      expect(generateData).toHaveBeenCalledWith("7 Days");
      expect(result).toEqual(["01 Jan ", "01 Jan "]);
    });

    it("should use generateData for ALL_CHART_THRITY_DAYS", () => {
      const result = chartMenu([], "30 Days");
      expect(generateData).toHaveBeenCalledWith("30 Days");
      expect(result).toEqual(["01 Jan ", "01 Jan "]);
    });

    it("should use generateData for TRANS_HISTORY_CHART_YEAR", () => {
      const result = chartMenu(null, "1 Year");
      expect(generateData).toHaveBeenCalledWith("1 Year");
      expect(result).toEqual([" Jan 2023 ", " Jan 2023 "]);
    });

    it("should use generateData for unknown chartType", () => {
      const result = chartMenu(undefined, "unknown");
      expect(generateData).toHaveBeenCalledWith("unknown");
      expect(result).toEqual(["01 Jan 2023", "01 Jan 2023"]);
    });
  });
});

describe("chartSeriesValue", () => {
  const mockData = [{ count: 1 }, { count: "2" }, { count: 3 }];

  const mockGeneratedData = [{ count: 0 }, { count: "1" }];

  beforeEach(() => {
    jest.clearAllMocks();
    generateData.mockReturnValue(mockGeneratedData);
  });

  it("should return seriesData and maximum when data is provided", () => {
    const result = chartSeriesValue(mockData, "1 Day");
    expect(result.seriesData).toEqual([1, 2, 3]);
    expect(result.maximum).toEqual({ count: 3 });
    expect(generateData).not.toHaveBeenCalled();
  });

  it("should use generateData when data is not provided", () => {
    const result = chartSeriesValue([], "1 Day");
    expect(generateData).toHaveBeenCalledWith("1 Day");
    expect(result.seriesData).toEqual([0, 1]);
    expect(result.maximum).toEqual({ count: "1" });
  });

  it("should handle string counts correctly", () => {
    const dataWithStrings = [{ count: "10" }, { count: 5 }];
    const result = chartSeriesValue(dataWithStrings, "1 Day");
    expect(result.seriesData).toEqual([10, 5]);
    expect(result.maximum).toEqual({ count: "10" });
  });

  it("should handle empty data array", () => {
    generateData.mockReturnValue([]);
    const result = chartSeriesValue([], "1 Day");
    expect(result.seriesData).toEqual([]);
    expect(result.maximum).toBeUndefined(); // since reduce on empty array
  });
});
