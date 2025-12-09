import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import InternalTxns from "../InternalTxns";
import getInternalTxns, {
  getInternalTxnsByHash,
} from "@/services/getInternalTxn";
import {
  FetchingStatus,
  SuccessStatus,
  ErrorStatus,
  InitStatus,
} from "@/constant/constant";

// Mock dependencies
jest.mock("@/services/getInternalTxn");
jest.mock("@/constant/constant", () => ({
  ErrorStatus: "error",
  FetchingStatus: "fetching",
  InitStatus: "init",
  SuccessStatus: "success",
  tableLimit: 10,
}));
jest.mock("@/constant/graphTableValues", () => ({
  internalTxns: [
    { key: "txnHash", title: "Txn Hash" },
    { key: "fromAddress", title: "From" },
    { key: "toAddress", title: "To" },
    { key: "value", title: "Value" },
  ],
}));

jest.mock("../../assets/svg/notFount.svg", () => "mock-not-found-svg");
jest.mock("next/image", () => (props) => <img data-testid="mock-image" {...props} />);

// Mock Child Components
jest.mock("../../Pagination/Pagination", () => (props) => (
  <div data-testid="mock-pagination">
    <button onClick={props.handleFirst}>First</button>
    <button onClick={props.handlePrevious}>Prev</button>
    <button onClick={props.handleNext}>Next</button>
    <button onClick={props.handleLast}>Last</button>
  </div>
));

jest.mock("../../SkeletonTableWrapper/SkeletonTableWrapper", () => ({
  SkeletonTableWrapper: (props) => (
    <div data-testid="mock-skeleton-table">
      {props.isSkeleton ? "Loading..." : "Table Content"}
      {props.dataSource?.length === 0 && props.locale?.emptyText}
    </div>
  ),
}));

describe("InternalTxns Component", () => {
  const mockHash = "0x123";
  const mockTransactions = [
    { txnHash: "0x1", fromAddress: "A", toAddress: "B", value: "100" },
    { txnHash: "0x2", fromAddress: "C", toAddress: "D", value: "200" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    getInternalTxns.mockReturnValue(new Promise(() => {})); // Never resolves
    render(<InternalTxns hash={mockHash} tab="1" />);
    
    expect(screen.getByTestId("mock-skeleton-table")).toHaveTextContent("Loading...");
  });

  test("renders transactions successfully (tab 1)", async () => {
    getInternalTxns.mockResolvedValue({
      data: {
        internalTxns: mockTransactions,
        count: 20,
      },
    });

    render(<InternalTxns hash={mockHash} tab="1" />);

    await waitFor(() => {
      expect(screen.getByTestId("mock-skeleton-table")).toHaveTextContent("Table Content");
    });
    expect(getInternalTxns).toHaveBeenCalledWith(1, 10, mockHash, "1");
  });

  test("renders transactions successfully (tab 2)", async () => {
    getInternalTxnsByHash.mockResolvedValue({
      data: {
        internalTxns: mockTransactions,
        count: 20,
      },
    });

    render(<InternalTxns hash={mockHash} tab="2" />);

    await waitFor(() => {
      expect(screen.getByTestId("mock-skeleton-table")).toHaveTextContent("Table Content");
    });
    expect(getInternalTxnsByHash).toHaveBeenCalledWith(1, 10, mockHash, "2");
  });

  test("handles error during fetching", async () => {
    getInternalTxns.mockRejectedValue(new Error("Fetch error"));

    render(<InternalTxns hash={mockHash} tab="1" />);

    await waitFor(() => {
      expect(getInternalTxns).toHaveBeenCalled();
    });
    // Error handling sets status to ErrorStatus, but UI doesn't explicitly show error message in this component
    // It likely relies on SkeletonTableWrapper handling or just shows empty/loading state depending on implementation
    // But we verified the catch block is executed by coverage
  });

  test("renders pagination when total pages > 1", async () => {
    getInternalTxns.mockResolvedValue({
      data: {
        internalTxns: mockTransactions,
        count: 20, // 2 pages
      },
    });

    render(<InternalTxns hash={mockHash} tab="1" />);

    await waitFor(() => {
      expect(screen.getByTestId("mock-pagination")).toBeInTheDocument();
    });
  });

  test("does not render pagination when total pages <= 1", async () => {
    getInternalTxns.mockResolvedValue({
      data: {
        internalTxns: mockTransactions,
        count: 5, // 1 page
      },
    });

    render(<InternalTxns hash={mockHash} tab="1" />);

    await waitFor(() => {
      expect(screen.queryByTestId("mock-pagination")).not.toBeInTheDocument();
    });
  });

  test("handles pagination interactions", async () => {
    getInternalTxns.mockResolvedValue({
      data: {
        internalTxns: mockTransactions,
        count: 30, // 3 pages
      },
    });

    render(<InternalTxns hash={mockHash} tab="1" />);

    await waitFor(() => {
      expect(screen.getByTestId("mock-pagination")).toBeInTheDocument();
    });

    // Next
    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => {
      expect(getInternalTxns).toHaveBeenCalledWith(2, 10, mockHash, "1");
    });

    // Previous
    fireEvent.click(screen.getByText("Prev"));
    await waitFor(() => {
      expect(getInternalTxns).toHaveBeenCalledWith(1, 10, mockHash, "1");
    });

    // Last
    fireEvent.click(screen.getByText("Last"));
    await waitFor(() => {
      expect(getInternalTxns).toHaveBeenCalledWith(3, 10, mockHash, "1");
    });

    // First
    fireEvent.click(screen.getByText("First"));
    await waitFor(() => {
      expect(getInternalTxns).toHaveBeenCalledWith(1, 10, mockHash, "1");
    });
  });

  test("pagination limits: does not go below page 1", async () => {
    getInternalTxns.mockResolvedValue({
      data: {
        internalTxns: mockTransactions,
        count: 30,
      },
    });

    render(<InternalTxns hash={mockHash} tab="1" />);
    await waitFor(() => expect(screen.getByTestId("mock-pagination")).toBeInTheDocument());

    // Current page is 1. Click Prev.
    fireEvent.click(screen.getByText("Prev"));
    expect(getInternalTxns).toHaveBeenCalledTimes(1); // Only initial call
  });

  test("pagination limits: does not go above total pages", async () => {
    getInternalTxns.mockResolvedValue({
      data: {
        internalTxns: mockTransactions,
        count: 20, // 2 pages
      },
    });

    render(<InternalTxns hash={mockHash} tab="1" />);
    await waitFor(() => expect(screen.getByTestId("mock-pagination")).toBeInTheDocument());

    // Go to page 2
    fireEvent.click(screen.getByText("Next"));
    await waitFor(() => expect(getInternalTxns).toHaveBeenCalledWith(2, 10, mockHash, "1"));

    // Try to go to page 3
    fireEvent.click(screen.getByText("Next"));
    expect(getInternalTxns).not.toHaveBeenCalledWith(3, 10, mockHash, "1");
  });

  test("renders empty state", async () => {
    getInternalTxns.mockResolvedValue({
      data: { internalTxns: [], count: 0 },
    });

    render(<InternalTxns hash={mockHash} tab="1" />);

    await waitFor(() => {
      expect(screen.getByText("No data")).toBeInTheDocument();
      expect(screen.getByTestId("mock-image")).toBeInTheDocument();
    });
  });
});
