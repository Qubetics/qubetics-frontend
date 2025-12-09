import { renderHook, act } from "@testing-library/react";
import useAverageBlockTime from "./useAverageBlockTime";
import { useLatestData } from "../contexts/latest_data";

jest.mock("../contexts/latest_data");

describe("useAverageBlockTime Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should initialize with correct default values", () => {
    useLatestData.mockReturnValue({});

    const { result } = renderHook(() => useAverageBlockTime());

    expect(result.current.diffs).toEqual([]);
    expect(result.current.setBlockData).toBeInstanceOf(Function);
  });

  test("should insert first websocket block into recentBlocks", () => {
    useLatestData.mockReturnValue({
      blocks: {
        blocknumber: 100,
        blockhash: "abc",
        timestamp: 1700000000,
      },
    });

    const { result, rerender } = renderHook(() => useAverageBlockTime());

    act(() => {
      rerender();
    });

    expect(result.current.diffs).toEqual([]);
  });

  test("should add new block if blocknumber not in recentBlocks", () => {
    let mockData = {
      blocks: {
        blocknumber: 101,
        blockhash: "hash101",
        timestamp: 1700001000,
      },
    };

    useLatestData.mockReturnValue(mockData);

    const { result, rerender } = renderHook(() => useAverageBlockTime());

    act(() => {
      rerender();
    });

    act(() => {
      result.current.setBlockData([{ block_number: 50 }, { block_number: 60 }]);
    });

    rerender();

    expect(result.current.diffs).toEqual([]);
  });

  test("should calculate diff when new block timestamp arrives", () => {
    let firstBlock = {
      blocks: {
        blocknumber: 1,
        blockhash: "aaa",
        timestamp: 1700000000000,
      },
    };

    let secondBlock = {
      blocks: {
        blocknumber: 2,
        blockhash: "bbb",
        timestamp: 1700000300000, // +300 seconds → diff = 300s
      },
    };

    useLatestData.mockReturnValue(firstBlock);

    const { result, rerender } = renderHook(() => useAverageBlockTime());

    act(() => rerender());

    // Set first block as internal "block"
    act(() => {
      result.current.setBlockData([{ block_number: 1 }]);
    });

    // Now mock second
    useLatestData.mockReturnValue(secondBlock);

    act(() => rerender());

    expect(result.current.diffs.length).toBeGreaterThan(0);

    // Diff should be 300 seconds
    expect(result.current.diffs[result.current.diffs.length - 1]).toBeCloseTo(
      300
    );
  });

  test("should not add duplicate block numbers", () => {
    let block1 = {
      blocks: {
        blocknumber: 50,
        blockhash: "xxx",
        timestamp: 1700000000,
      },
    };

    useLatestData.mockReturnValue(block1);

    const { result, rerender } = renderHook(() => useAverageBlockTime());

    act(
      () => result.current.setBlockData([{ block_number: 50 }]) // already exists
    );

    rerender();

    // No new diff should be added for same block
    expect(result.current.diffs).toEqual([]);
  });
});
