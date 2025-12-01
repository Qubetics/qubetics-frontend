import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DvpnTransactions from "../DvpnTransactions";
import tokenTransaction from "@/services/tokenTransaction";
import { useParams } from "next/navigation";
import { useGetNetwork } from "../../contexts/networkChanged";
import { FetchingStatus, InitStatus } from "@/constant/constant";

// MOCKS
jest.mock("@/services/tokenTransaction");
jest.mock("next/navigation", () => ({
    useParams: jest.fn(),
}));

jest.mock("../../contexts/networkChanged", () => ({
    useGetNetwork: jest.fn(),
}));

jest.mock("../../SkeletonTableWrapper/SkeletonTableWrapper", () => ({
    SkeletonTableWrapper: ({ isSkeleton }) => (
        <div>{isSkeleton ? "Loading..." : "Table Loaded"}</div>
    ),
}));

jest.mock("../../Pagination/Pagination", () => (props) => (
    <div>
        <button
            data-testid="prev-btn"
            onClick={props.handlePrevious}
            disabled={props.disablePrev}
        >
            Prev
        </button>
        <button
            data-testid="next-btn"
            onClick={props.handleNext}
            disabled={props.disableNext}
        >
            Next
        </button>
        <button
            data-testid="first-btn"
            onClick={props.handleFirst}
        >
            First
        </button>
        <button
            data-testid="last-btn"
            onClick={props.handleLast}
        >
            Last
        </button>
    </div>
));

describe("DvpnTransactions Component", () => {
    const setTokensTxData = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useParams.mockReturnValue({ addressDetail: "0x123" });
        useGetNetwork.mockReturnValue({ isNetworkChanged: false });
    });

    it("renders loading skeleton initially", () => {
        tokenTransaction.mockResolvedValue({
            data: { transactions: [], count: 0 },
        });

        render(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("fetches and displays data successfully", async () => {
        tokenTransaction.mockResolvedValue({
            data: { transactions: [{ id: 1 }], count: 10 },
        });

        render(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        await waitFor(() => {
            expect(screen.getByText("Table Loaded")).toBeInTheDocument();
        });

        expect(setTokensTxData).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it("displays pagination when more than 1 page exists", async () => {
        tokenTransaction.mockResolvedValue({
            data: { transactions: [], count: 40 }, // > tableLimit
        });

        render(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        await waitFor(() =>
            expect(screen.getByTestId("next-btn")).toBeInTheDocument()
        );
    });

    it("calls next page handler", async () => {
        tokenTransaction.mockResolvedValue({
            data: { transactions: [], count: 40 },
        });

        render(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        await waitFor(() =>
            expect(screen.getByTestId("next-btn")).toBeInTheDocument()
        );

        fireEvent.click(screen.getByTestId("next-btn"));

        expect(tokenTransaction).toHaveBeenCalledTimes(2); // First load + after next click
    });

    it("calls previous page handler", async () => {
        tokenTransaction.mockResolvedValue({
            data: { transactions: [], count: 40 },
        });

        render(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        await waitFor(() =>
            expect(screen.getByTestId("next-btn")).toBeInTheDocument()
        );

        // go next page first
        fireEvent.click(screen.getByTestId("next-btn"));

        // now prev should work
        fireEvent.click(screen.getByTestId("prev-btn"));

        expect(tokenTransaction).toHaveBeenCalledTimes(3);
    });

    it("refetches data when network changes", async () => {
        // Start with false
        useGetNetwork.mockReturnValue({ isNetworkChanged: false });

        tokenTransaction.mockResolvedValue({
            data: { transactions: [], count: 20 },
        });

        const { rerender } = render(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        // Initial fetch
        await waitFor(() => {
            expect(tokenTransaction).toHaveBeenCalledTimes(1);
        });

        // Change to true
        useGetNetwork.mockReturnValue({ isNetworkChanged: true });
        rerender(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        // Should fetch again
        await waitFor(() => {
            expect(tokenTransaction).toHaveBeenCalledTimes(2);
        });
    });

    it("calls last page handler", async () => {
        tokenTransaction.mockResolvedValue({
            data: { transactions: [], count: 40 }, // 4 pages
        });

        render(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        await waitFor(() =>
            expect(screen.getByTestId("last-btn")).toBeInTheDocument()
        );

        fireEvent.click(screen.getByTestId("last-btn"));

        expect(tokenTransaction).toHaveBeenCalledTimes(2);
    });

    it("calls first page handler", async () => {
        tokenTransaction.mockResolvedValue({
            data: { transactions: [], count: 40 },
        });

        render(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        await waitFor(() =>
            expect(screen.getByTestId("last-btn")).toBeInTheDocument()
        );

        // Go to last page
        fireEvent.click(screen.getByTestId("last-btn"));

        // Go to first page
        fireEvent.click(screen.getByTestId("first-btn"));

        expect(tokenTransaction).toHaveBeenCalledTimes(3);
    });

    it("handles API error", async () => {
        tokenTransaction.mockRejectedValue(new Error("API Error"));

        render(<DvpnTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />);

        await waitFor(() =>
            expect(screen.getByText("Loading...")).toBeInTheDocument()
        );
    });
});
