import { renderHook, act } from "@testing-library/react";
import useBlockData from "../useBlockData";
import { useLatestData } from "@/components/contexts/latest_data";

jest.mock("@/components/contexts/latest_data", () => ({
  useLatestData: jest.fn(),
}));

describe("useBlockData Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns default values initially", () => {
    useLatestData.mockReturnValue(null);

    const { result } = renderHook(() => useBlockData());

    expect(result.current.lastBlock).toBe(6);
    expect(result.current.blockHeight).toBe("");
    expect(result.current.webSocket).toBe(null);
  });

  test("updates blockHeight from websocket", () => {
    useLatestData.mockReturnValue({
      blocks: { blocknumber: 50 },
    });

    const { result } = renderHook(() => useBlockData());

    expect(result.current.blockHeight).toBe(50);
  });

  test("does nothing when no previous block", () => {
    useLatestData.mockReturnValue({
      blocks: { blocknumber: 10, timestamp: "2024-01-01T00:00:00Z" },
    });

    const { result } = renderHook(() => useBlockData());

    // first update → prevBlockRef becomes set
    expect(result.current.lastBlock).toBe(6); // no calculation yet
  });

  test("does nothing when blocknumber has not changed", () => {
    useLatestData
      .mockReturnValueOnce({
        blocks: { blocknumber: 1, timestamp: "2024-01-01T00:00:00Z" },
      })
      .mockReturnValueOnce({
        blocks: { blocknumber: 1, timestamp: "2024-01-01T00:01:00Z" },
      });

    const { result, rerender } = renderHook(() => useBlockData());

    expect(result.current.lastBlock).toBe(6);

    rerender();
    expect(result.current.lastBlock).toBe(6); // still unchanged
  });

  test("calculates time difference when block changes", () => {
    // First render → stores previous block
    useLatestData
      .mockReturnValueOnce({
        blocks: {
          blocknumber: 1,
          timestamp: "2024-01-01T00:00:00Z",
        },
      })
      // Second render → new block
      .mockReturnValueOnce({
        blocks: {
          blocknumber: 2,
          timestamp: "2024-01-01T00:00:10Z",
        },
      });

    const { result, rerender } = renderHook(() => useBlockData());

    expect(result.current.lastBlock).toBe(6); // initial

    rerender();

    expect(result.current.lastBlock).toBe(10); // 10 seconds difference
  });
});
