import { renderHook, act } from "@testing-library/react";
import useGlobalSearch from "../useGlobalSearch";

import getSearchingValue from "@/services/getGlobalSearch";
import getChainAbstractionSearch from "@/services/getChainAbstractionSearch";
import useDebounce from "../useDebounce";
import { isValidAlphaNumeric } from "@/utils/commonFunctions";
import { useRouter } from "next/navigation";

// Mocks
jest.mock("@/services/getGlobalSearch");
jest.mock("@/services/getChainAbstractionSearch");
jest.mock("../useDebounce");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("@/utils/commonFunctions", () => ({
  isValidAlphaNumeric: jest.fn(),
}));

describe("useGlobalSearch Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // mock router
    useRouter.mockReturnValue({
      push: jest.fn(),
    });

    // mock debounce
    useDebounce.mockReturnValue({
      debounce: "",
      setDebounce: jest.fn(),
    });

    // mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "EVM Chain"),
      },
      writable: true,
    });
  });

  test("should initialize with default values", () => {
    const { result } = renderHook(() => useGlobalSearch());

    expect(result.current.searchText).toBe("");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.searchResult).toEqual([]);
    expect(result.current.dynamicTab).toEqual([]);
    expect(result.current.err).toBe(false);
  });

  test("should not call API when debounce is empty", () => {
    useDebounce.mockReturnValue({
      debounce: "",
    });

    renderHook(() => useGlobalSearch());

    expect(getSearchingValue).not.toHaveBeenCalled();
    expect(getChainAbstractionSearch).not.toHaveBeenCalled();
  });

  test("should handle successful EVM response with results", async () => {
    useDebounce.mockReturnValue({ debounce: "0x123" });

    getSearchingValue.mockResolvedValue({
      error: false,
      data: {
        tabs: ["transaction"],
        results: {
          transaction: [{ address: "0xtx" }],
        },
      },
    });

    const { result } = renderHook(() => useGlobalSearch());

    await act(async () => {});

    expect(result.current.err).toBe(false);
    expect(result.current.dynamicTab).toEqual(["transaction"]);
    expect(result.current.searchResult).toEqual({
      results: { transaction: [{ address: "0xtx" }] },
      tabs: ["transaction"],
    });
  });

  test("should use getResponse() when EVM data has no results", async () => {
    useDebounce.mockReturnValue({ debounce: "abc" });

    getSearchingValue.mockResolvedValue({
      error: false,
      data: {
        transaction: {
          hash: "0xHASH",
        },
      },
    });

    const { result } = renderHook(() => useGlobalSearch());

    await act(async () => {});

    expect(result.current.dynamicTab).toEqual(["transaction"]);
    expect(result.current.searchResult).toEqual({
      results: {
        transaction: [{ address: "0xHASH" }],
      },
    });
  });

  test("should trigger fallback API when first API returns error", async () => {
    useDebounce.mockReturnValue({ debounce: "ABCD" });
    isValidAlphaNumeric.mockReturnValue(true);

    getSearchingValue.mockResolvedValue({ error: true });
    getChainAbstractionSearch.mockResolvedValue({
      error: false,
      data: {
        account: { user: { address: "0xUSER" } },
      },
    });

    const { result } = renderHook(() => useGlobalSearch());

    await act(async () => {});

    expect(result.current.err).toBe(false);
    expect(result.current.dynamicTab).toEqual(["account"]);
    expect(result.current.searchResult).toEqual({
      results: {
        account: [{ address: "0xUSER" }],
      },
    });
  });

  test("should set error when both APIs fail", async () => {
    useDebounce.mockReturnValue({ debounce: "XYZ" });
    isValidAlphaNumeric.mockReturnValue(true);

    getSearchingValue.mockResolvedValue({ error: true });
    getChainAbstractionSearch.mockResolvedValue({ error: true });

    const { result } = renderHook(() => useGlobalSearch());

    await act(async () => {});

    expect(result.current.err).toBe(true);
    expect(result.current.searchResult).toEqual([]);
    expect(result.current.dynamicTab).toEqual([]);
  });

  test("should set error when isValidAlphaNumeric returns false", async () => {
    useDebounce.mockReturnValue({ debounce: "@@@" });
    isValidAlphaNumeric.mockReturnValue(false);

    getSearchingValue.mockResolvedValue({ error: true });

    const { result } = renderHook(() => useGlobalSearch());
    await act(async () => {});

    expect(result.current.err).toBe(true);
    expect(result.current.dynamicTab).toEqual([]);
    expect(result.current.searchResult).toEqual([]);
  });

  test("should handle intentList type correctly", async () => {
    useDebounce.mockReturnValue({ debounce: "intent" });

    getSearchingValue.mockResolvedValue({
      error: false,
      data: {
        intentList: [
          {
            intent_hash: "INTENT_HASH",
          },
        ],
      },
    });

    const { result } = renderHook(() => useGlobalSearch());
    await act(async () => {});

    expect(result.current.dynamicTab).toEqual(["intentList"]);
    expect(result.current.searchResult).toEqual({
      results: {
        intentList: [{ address: "INTENT_HASH" }],
      },
    });
  });
});
