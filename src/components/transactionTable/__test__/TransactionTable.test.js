import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TransactionTable from "../TransactionTable";
import getTransactionByBlocks from "@/services/getTransactionByBlocks";
import { useGetNetwork } from "@/components/contexts/networkChanged";

// Mock dependencies
jest.mock("@/services/getTransactionByBlocks");
jest.mock("@/components/contexts/networkChanged", () => ({
  useGetNetwork: jest.fn(),
}));

jest.mock("../../SkeletonTableWrapper/SkeletonTableWrapper", () => ({
  SkeletonTableWrapper: ({ isSkeleton }) => (
    <div data-testid={isSkeleton ? "skeleton" : "table-loaded"} />
  ),
}));

jest.mock("../../Pagination/Pagination", () => {
  return function PaginationComponent({
    handleNext,
    handlePrevious,
    currentPage,
    totalPages,
  }) {
    return (
      <div>
        <button data-testid="prev-btn" onClick={handlePrevious}>
          Prev
        </button>
        <span data-testid="page-indicator">{currentPage}</span>
        <button data-testid="next-btn" onClick={handleNext}>
          Next
        </button>
        <span data-testid="total-pages">{totalPages}</span>
      </div>
    );
  };
});

describe("TransactionTable Component Tests", () => {
  const mockParams = "12345";

  beforeEach(() => {
    jest.clearAllMocks();
    useGetNetwork.mockReturnValue({ isNetworkChanged: false });
  });

  test("renders skeleton initially", () => {
    getTransactionByBlocks.mockResolvedValue({
      error: false,
      data: { transaction: [], count: 0 },
    });

    render(<TransactionTable params={mockParams} />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  test("loads data and shows table (no skeleton)", async () => {
    getTransactionByBlocks.mockResolvedValue({
      error: false,
      data: { transaction: [{ id: 1 }], count: 10 },
    });

    render(<TransactionTable params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByTestId("table-loaded")).toBeInTheDocument();
    });
  });

  test("pagination next and previous works", async () => {
    getTransactionByBlocks.mockResolvedValue({
      error: false,
      data: { transaction: [{ id: 1 }], count: 20 }, 
    });

    render(<TransactionTable params={mockParams} />);

    await waitFor(() =>
      expect(screen.getByTestId("table-loaded")).toBeInTheDocument()
    );

    const nextBtn = screen.getByTestId("next-btn");
    const prevBtn = screen.getByTestId("prev-btn");
    const pageIndicator = screen.getByTestId("page-indicator");

    // Initially page = 1
    expect(pageIndicator.textContent).toBe("1");

    // Go to page 2
    fireEvent.click(nextBtn);
    expect(pageIndicator.textContent).toBe("2");

    // Back to page 1
    fireEvent.click(prevBtn);
    expect(pageIndicator.textContent).toBe("1");
  });

  test("refetches when network changes", async () => {
    useGetNetwork.mockReturnValue({ isNetworkChanged: true });

    getTransactionByBlocks.mockResolvedValue({
      error: false,
      data: { transaction: [], count: 0 },
    });

    render(<TransactionTable params={mockParams} />);

    await waitFor(() => {
      expect(getTransactionByBlocks).toHaveBeenCalledTimes(2); 
      // 1: initial load
      // 2: network changed trigger
    });
  });

  test("handles API error state", async () => {
    getTransactionByBlocks.mockResolvedValue({
      error: true,
    });

    render(<TransactionTable params={mockParams} />);

    await waitFor(() => {
      expect(screen.getByTestId("table-loaded")).toBeInTheDocument();
    });
  });
});
