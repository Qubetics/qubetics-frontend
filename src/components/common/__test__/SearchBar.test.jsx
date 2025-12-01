/**
 * TEST SUITE FOR SearchbarComponent
 * Deeply covers:
 * - search input behavior
 * - router navigation
 * - API result handling
 * - correct switching of cases from component
 * - status updates
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchbarComponent from "./../SearchBar";
import { useThemeData } from "@/components/contexts/theme_context";
import { useSearchData } from "@/components/contexts/searchingData";
import getSearchingValue from "@/services/search";
import { useRouter, usePathname } from "next/navigation";
import {
  ErrorStatus,
  FetchingStatus,
  Routes,
} from "@/constant/constant";

// MOCKS
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@/components/contexts/theme_context", () => ({
  useThemeData: jest.fn(),
}));

jest.mock("@/components/contexts/searchingData", () => ({
  useSearchData: jest.fn(),
}));

jest.mock("@/services/search", () => jest.fn());

jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
  },
}));

// loader mock
jest.mock("../../loader/Loader", () => () => (
  <div data-testid="loader">Loading...</div>
));

const mockPush = jest.fn();

describe("SearchbarComponent - Deep Tests", () => {
  let setSearchValue;
  let setSearchData;
  let setSerachStatus;

  beforeEach(() => {
    jest.clearAllMocks();

    setSearchValue = jest.fn();
    setSearchData = jest.fn();
    setSerachStatus = jest.fn();

    useThemeData.mockReturnValue({ isLight: "darkTheme" });

    useSearchData.mockReturnValue({
      searchData: "",
      searchValue: "",
      setSearchValue,
      setSearchData,
    });

    useRouter.mockReturnValue({ push: mockPush });

    usePathname.mockReturnValue("/");
  });

  const setup = (searchStatus = "") =>
    render(
      <SearchbarComponent
        searchStatus={searchStatus}
        setSerachStatus={setSerachStatus}
        onFocus={jest.fn()}
        onBlur={jest.fn()}
      />
    );

  // ---------------------------------------------------
  // INPUT CHANGE TEST
  // ---------------------------------------------------
  test("should update input value with alphanumeric values only", () => {
    setup();

    const input = screen.getByPlaceholderText(/Search for an address/i);

    fireEvent.change(input, { target: { value: "abc123" } });
    expect(setSearchValue).toHaveBeenCalledWith("abc123");

    // non-alphanumeric ignored
    fireEvent.change(input, { target: { value: "abc123###" } });
    expect(setSearchValue).toHaveBeenCalledTimes(1);
  });

  // ---------------------------------------------------
  // PRESS ENTER TO SEARCH
  // ---------------------------------------------------
  test("should trigger search when pressing Enter with value", () => {
    useSearchData.mockReturnValue({
      searchValue: "123",
      setSearchValue,
      setSearchData,
    });

    setup();

    const input = screen.getByPlaceholderText(/Search for an address/i);

    fireEvent.keyUp(input, { key: "Enter" });

    // Search will start
    expect(setSerachStatus).toHaveBeenCalledWith(FetchingStatus);
  });

  // ---------------------------------------------------
  // DISPLAY LOADER WHEN FETCHING
  // ---------------------------------------------------
  test("should show loader when status = Fetching", () => {
    setup(FetchingStatus);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  // ---------------------------------------------------
  // EMPTY INPUT → ERROR
  // ---------------------------------------------------
  test("should show error when clicking search with empty input", async () => {
    const { toast } = require("react-toastify");

    useSearchData.mockReturnValue({
      searchValue: "",
      setSearchValue,
      setSearchData,
    });

    setup();

    const button = screen.getByText("Search");
    fireEvent.click(button);

    expect(toast.error).toHaveBeenCalledWith("Enter search item");
  });

  // ---------------------------------------------------
  // 64 CHAR VALUE → PREFIX 0x
  // ---------------------------------------------------
  test("should prefix searchValue with 0x when length is 64", async () => {
    const fakeValue = "a".repeat(64);

    useSearchData.mockReturnValue({
      searchValue: fakeValue,
      setSearchValue,
      setSearchData,
    });

    getSearchingValue.mockResolvedValue({
      error: false,
      data: { block: { blocknumber: fakeValue } },
    });

    setup();

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(getSearchingValue).toHaveBeenCalledWith("0x" + fakeValue);
    });
  });

  // ---------------------------------------------------
  // CASE 1: BLOCK SEARCH
  // ---------------------------------------------------
  test("should navigate to block page when blocknumber matches", async () => {
    useSearchData.mockReturnValue({
      searchValue: "55",
      setSearchValue,
      setSearchData,
    });

    getSearchingValue.mockResolvedValue({
      error: false,
      data: { block: { blocknumber: "55" } },
    });

    setup();

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`${Routes.BLOCK_NO}55`);
    });
  });

  // ---------------------------------------------------
  // CASE 2: TRANSACTION HASH
  // ---------------------------------------------------
  test("should navigate to tx hash page when transaction found", async () => {
    useSearchData.mockReturnValue({
      searchValue: "0x123",
      setSearchValue,
      setSearchData,
    });

    getSearchingValue.mockResolvedValue({
      error: false,
      data: { transaction: { txhash: "0x123" } },
    });

    setup();

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`${Routes.Tx_Hash}0x123`);
    });
  });

  // ---------------------------------------------------
  // CASE 3: CONTRACT ADDRESS
  // ---------------------------------------------------
  test("should navigate to contract page if contractAddress = true", async () => {
    useSearchData.mockReturnValue({
      searchValue: "0xabcd",
      setSearchValue,
      setSearchData,
    });

    getSearchingValue.mockResolvedValue({
      error: false,
      data: { isContractAddress: true, transactions: [1] },
    });

    setup();
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`${Routes.CONTRACT_DETAIL}0xabcd`);
    });
  });

  // ---------------------------------------------------
  // CASE 4: NORMAL ADDRESS
  // ---------------------------------------------------
  test("should navigate to address page if contractAddress = false", async () => {
    useSearchData.mockReturnValue({
      searchValue: "0xabcd",
      setSearchValue,
      setSearchData,
    });

    getSearchingValue.mockResolvedValue({
      error: false,
      data: { isContractAddress: false, transactions: [1] },
    });

    setup();
    fireEvent.click(screen.getByText("Search"));

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(`${Routes.Tx_ADDRESS}0xabcd`)
    );
  });

  // ---------------------------------------------------
  // DEFAULT → NOT FOUND
  // ---------------------------------------------------
  test("should redirect to NOT_FOUND on unknown search", async () => {
    useSearchData.mockReturnValue({
      searchValue: "xyz",
      setSearchValue,
      setSearchData,
    });

    getSearchingValue.mockResolvedValue({
      error: false,
      data: {},
    });

    setup();

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(Routes.NOT_FOUND);
      expect(setSerachStatus).toHaveBeenCalledWith(ErrorStatus);
    });
  });

  // ---------------------------------------------------
  // API ERROR → NOT FOUND
  // ---------------------------------------------------
  test("should handle API error correctly", async () => {
    useSearchData.mockReturnValue({
      searchValue: "abc",
      setSearchValue,
      setSearchData,
    });

    getSearchingValue.mockRejectedValue(new Error("API failed"));

    setup();

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(Routes.NOT_FOUND);
      expect(setSerachStatus).toHaveBeenCalledWith(ErrorStatus);
    });
  });
});
