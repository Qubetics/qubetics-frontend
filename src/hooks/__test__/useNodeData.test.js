import { renderHook } from "@testing-library/react";
import { useNodeData } from "../useNodeData";

import { useLatestData } from "@/components/contexts/latest_data";
import { randomNoGenerator } from "@/utils/commonFunctions";

// Mock dependencies
jest.mock("@/components/contexts/latest_data");
jest.mock("@/utils/commonFunctions");

describe("useNodeData hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return correct nodePerformanceData with blockHeight", () => {
    // Mock the websocket data
    useLatestData.mockReturnValue({
      blocks: { blocknumber: 12345 },
    });

    // Mock random generator
    randomNoGenerator.mockReturnValue(10);

    const { result } = renderHook(() => useNodeData());

    const data = result.current.nodePerformanceData;

    expect(data.length).toBe(4);

    expect(data[0]).toEqual({
      value: 12345,
      label: "Block Height",
    });

    expect(data[1]).toEqual({
      value: "15",
      label: "Total Nodes",
    });

    expect(data[2]).toEqual({
      value: "10s", // 10 (mock) + "s"
      label: "Last Blocks",
    });

    expect(data[3]).toEqual({
      value: "6",
      label: "Countries",
    });
  });

  test("should return empty string if blocknumber missing", () => {
    useLatestData.mockReturnValue({ blocks: {} });
    randomNoGenerator.mockReturnValue(5);

    const { result } = renderHook(() => useNodeData());

    expect(result.current.nodePerformanceData[0].value).toBe("");
    expect(result.current.nodePerformanceData[2].value).toBe("5s");
  });
});
