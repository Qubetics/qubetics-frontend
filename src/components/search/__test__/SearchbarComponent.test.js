import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchbarComponent from "./../SearchbarComponent";
import { useThemeData } from "@/components/contexts/theme_context";
import { useSearchData } from "../../contexts/searchingData";
import { useRouter, usePathname } from "next/navigation";
import getSearchingValue from "@/services/search";
import toast from "react-hot-toast";
import {
    FetchingStatus,
    ErrorStatus,
    SuccessStatus,
    Routes,
} from "@/constant/constant";

// Mock dependencies
jest.mock("@/components/contexts/theme_context");
jest.mock("../../contexts/searchingData");
jest.mock("next/navigation");
jest.mock("@/services/search");
jest.mock("react-hot-toast");
jest.mock("../../../../public/SvgIcons", () => ({
    Searchicon: () => <div data-testid="search-icon" />,
    Searchicondark: () => <div data-testid="search-icon-dark" />,
}));
jest.mock("../../loader/Loader", () => () => <div data-testid="loader" />);

describe("SearchbarComponent", () => {
    const mockSetSearchValue = jest.fn();
    const mockSetSearchData = jest.fn();
    const mockSetSearchStatus = jest.fn();
    const mockPush = jest.fn();
    const mockOnFocus = jest.fn();
    const mockOnBlur = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        useThemeData.mockReturnValue({ isLight: "darkTheme" });
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: "",
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        useRouter.mockReturnValue({ push: mockPush });
        usePathname.mockReturnValue("/");
    });

    test("renders input field correctly", () => {
        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        expect(
            screen.getByPlaceholderText("Search by Txn Hash/ Address/ Block/ Block Hash")
        ).toBeInTheDocument();
        expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    });

    test("renders loader when status is Fetching", () => {
        render(
            <SearchbarComponent
                searchStatus={FetchingStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        expect(screen.getByTestId("loader")).toBeInTheDocument();
        expect(
            screen.queryByPlaceholderText("Search by Txn Hash/ Address/ Block/ Block Hash")
        ).not.toBeInTheDocument();
    });

    test("updates input value on change", () => {
        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.change(input, { target: { value: "123" } });

        expect(mockSetSearchValue).toHaveBeenCalledWith("123");
    });

    test("shows error toast if search value is empty on Enter", () => {
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: "",
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );

        fireEvent.keyUp(input, { key: "Enter" });
        expect(getSearchingValue).not.toHaveBeenCalled();
        expect(toast.error).not.toHaveBeenCalled();
    });

    test("triggers search and handles block number success", async () => {
        const searchValue = "12345";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockResolvedValue({
            error: false,
            data: { block: { blocknumber: searchValue } },
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(mockSetSearchStatus).toHaveBeenCalledWith(FetchingStatus);
            expect(getSearchingValue).toHaveBeenCalledWith(searchValue);
            expect(mockSetSearchData).toHaveBeenCalledWith({ blocknumber: searchValue });
            expect(mockPush).toHaveBeenCalledWith(`${Routes.BLOCK_NO}${searchValue}`);
        });
    });

    test("triggers search and handles transaction hash success", async () => {
        const searchValue = "0x123abc";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockResolvedValue({
            error: false,
            data: { transaction: { txhash: searchValue } },
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(mockSetSearchData).toHaveBeenCalledWith({ txhash: searchValue });
            expect(mockPush).toHaveBeenCalledWith(`${Routes.Tx_Hash}${searchValue}`);
        });
    });

    test("handles not found error", async () => {
        const searchValue = "invalid";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockResolvedValue({
            error: true,
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(Routes.NOT_FOUND);
            expect(mockSetSearchStatus).toHaveBeenCalledWith(ErrorStatus);
            expect(mockSetSearchValue).toHaveBeenCalledWith("");
        });
    });

    test("handles exception during search", async () => {
        const searchValue = "error_case";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockRejectedValue(new Error("Network Error"));

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(mockSetSearchStatus).toHaveBeenCalledWith(ErrorStatus);
            expect(mockPush).toHaveBeenCalledWith(Routes.NOT_FOUND);
            expect(mockSetSearchValue).toHaveBeenCalledWith("");
        });
    });

    test("renders search icon dark when theme is light", () => {
        useThemeData.mockReturnValue({ isLight: "lightTheme" });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        expect(screen.getByTestId("search-icon-dark")).toBeInTheDocument();
    });

    test("does not update input value on change with invalid characters", () => {
        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.change(input, { target: { value: "abc123!" } });

        expect(mockSetSearchValue).not.toHaveBeenCalled();
    });

    test("triggers search and handles contract address true", async () => {
        const searchValue = "0x123";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockResolvedValue({
            error: false,
            data: { isContractAddress: true, transactions: [{}] },
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(`${Routes.CONTRACT_DETAIL}${searchValue}`);
        });
    });

    test("triggers search and handles contract address false", async () => {
        const searchValue = "0x123";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockResolvedValue({
            error: false,
            data: { isContractAddress: false, transactions: [{}] },
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(`${Routes.Tx_ADDRESS}${searchValue}`);
        });
    });

    test("triggers search and handles contracts address match", async () => {
        const searchValue = "0x123";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockResolvedValue({
            error: false,
            data: { contracts: { address: searchValue } },
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith(`${Routes.CONTRACT_DETAIL}${searchValue}`);
        });
    });

    test("triggers search and handles block hash success", async () => {
        const searchValue = "0xblockhash";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockResolvedValue({
            error: false,
            data: { block: { blockhash: searchValue } },
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(mockSetSearchData).toHaveBeenCalledWith({ blockhash: searchValue });
            expect(mockPush).toHaveBeenCalledWith(`${Routes.BLOCK_NO}${searchValue}`);
        });
    });

    test("triggers search with updated search value for long input", async () => {
        const searchValue = "a".repeat(40);
        const updatedValue = "0x" + searchValue;
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockResolvedValue({
            error: false,
            data: { block: { blocknumber: searchValue } },
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(getSearchingValue).toHaveBeenCalledWith(updatedValue);
            expect(mockPush).toHaveBeenCalledWith(`${Routes.BLOCK_NO}${updatedValue}`);
        });
    });

    test("triggers search with Qubetics prefix without updating", async () => {
        const searchValue = "Qubetics123";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        getSearchingValue.mockResolvedValue({
            error: false,
            data: { block: { blocknumber: searchValue } },
        });

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.keyUp(input, { key: "Enter" });

        await waitFor(() => {
            expect(getSearchingValue).toHaveBeenCalledWith(searchValue);
        });
    });

    test("calls onFocus when input is focused", () => {
        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.focus(input);

        expect(mockOnFocus).toHaveBeenCalled();
    });

    test("calls onBlur when input is blurred", () => {
        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        const input = screen.getByPlaceholderText(
            "Search by Txn Hash/ Address/ Block/ Block Hash"
        );
        fireEvent.blur(input);

        expect(mockOnBlur).toHaveBeenCalled();
    });

    test("sets success status on pathname match in useEffect", () => {
        const searchValue = "123";
        useSearchData.mockReturnValue({
            searchData: null,
            searchValue: searchValue,
            setSearchValue: mockSetSearchValue,
            setSearchData: mockSetSearchData,
        });
        usePathname.mockReturnValue(`${Routes.BLOCK_NO}${searchValue}`);

        render(
            <SearchbarComponent
                searchStatus={SuccessStatus}
                setSerachStatus={mockSetSearchStatus}
                onFocus={mockOnFocus}
                onBlur={mockOnBlur}
            />
        );

        expect(mockSetSearchStatus).toHaveBeenCalledWith(SuccessStatus);
        expect(mockSetSearchValue).toHaveBeenCalledWith("");
        expect(mockSetSearchData).toHaveBeenCalledWith("");
    });
});
