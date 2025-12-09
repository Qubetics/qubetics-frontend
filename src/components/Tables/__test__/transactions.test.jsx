/**
 * @jest-environment jsdom
 */

import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Transactions from "../transactions";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import getTransactions from "@/services/getTransactions";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("@/components/contexts/networkChanged", () => ({
  useGetNetwork: jest.fn(),
}));

jest.mock("@/services/getTransactions");

jest.mock("../../SkeletonTableWrapper/SkeletonTableWrapper", () => ({
  SkeletonTableWrapper: ({ isSkeleton }) => (
    <div data-testid="skeleton">{isSkeleton ? "loading" : "loaded"}</div>
  ),
}));

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Select: ({ onChange, value, options, className }) => (
    <div
      className={className}
      onClick={() => onChange(options.find((o) => o.value !== value).value)}
    >
      {options.find((o) => o.value === value).label}
    </div>
  ),
}));

jest.mock("../../Pagination/Pagination", () => (props) => (
  <div>
    <button
      data-testid="next"
      onClick={props.handleNext}
      disabled={props.disableNext}
    >
      Next
    </button>
    <button
      data-testid="prev"
      onClick={props.handlePrevious}
      disabled={props.disablePrev}
    >
      Prev
    </button>
    <button
      data-testid="first"
      onClick={props.handleFirst}
      disabled={props.disablePrev}
    >
      First
    </button>
    <button
      data-testid="last"
      onClick={props.handleLast}
      disabled={props.disableNext}
    >
      Last
    </button>
  </div>
));

describe("Transactions Component", () => {
  let mockPush;
  let mockSetTxnData;

  beforeEach(() => {
    mockPush = jest.fn();
    mockSetTxnData = jest.fn();

    useRouter.mockReturnValue({ push: mockPush });

    useGetNetwork.mockReturnValue({
      isNetworkChanged: true,
    });

    useSearchParams.mockReturnValue(
      new URLSearchParams("?page=1&id=1&order=desc")
    );
  });

  test("renders loading skeleton initially", async () => {
    useGetNetwork.mockReturnValue({
      isNetworkChanged: false,
    });

    getTransactions.mockImplementation(() => new Promise(() => {})); // Never resolves

    await act(async () => {
      render(<Transactions setTxnData={mockSetTxnData} />);
    });

    expect(screen.getByTestId("skeleton")).toHaveTextContent("loading");
  });

  test("fetches and displays total transactions", async () => {
    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [{ hash: "0x1" }],
        count: 25,
        nextCursor: 2,
        prevCursor: 1,
        lastPage: 3,
      },
    });

    render(<Transactions setTxnData={mockSetTxnData} />);

    await waitFor(() => {
      expect(screen.getByText("Total of 25 transactions")).toBeInTheDocument();
    });

    expect(mockSetTxnData).toHaveBeenCalled();
  });

  test("table loads after fetch", async () => {
    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [],
        count: 10,
        nextCursor: 1,
        prevCursor: 1,
        lastPage: 1,
      },
    });

    await act(async () => {
      render(<Transactions setTxnData={mockSetTxnData} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("skeleton")).toHaveTextContent("loaded");
    });
  });

  test("handles API error properly", async () => {
    getTransactions.mockResolvedValue({ error: true });

    await act(async () => {
      render(<Transactions setTxnData={mockSetTxnData} />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("skeleton")).toHaveTextContent("loaded");
    });
  });

  test("changes order using dropdown", async () => {
    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [],
        count: 10,
        nextCursor: 2,
        prevCursor: 1,
        lastPage: 2,
      },
    });

    await act(async () => {
      render(<Transactions setTxnData={mockSetTxnData} />);
    });

    // Wait for the select to appear
    await waitFor(() => screen.getByText("Newest"));

    // Find the select by className
    const select = document.querySelector(".innerSelect");

    fireEvent.click(select);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("?page=1&id=1&order=asc");
    });
  });

  test("pagination next button works", async () => {
    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [],
        count: 100,
        nextCursor: 2,
        prevCursor: 1,
        lastPage: 4,
      },
    });

    await act(async () => {
      render(<Transactions setTxnData={mockSetTxnData} />);
    });

    await waitFor(() => screen.getByTestId("next"));
    fireEvent.click(screen.getByTestId("next"));

    expect(mockPush).toHaveBeenCalled();
  });

  test("previous button works", async () => {
    useSearchParams.mockReturnValue(
      new URLSearchParams("?page=2&id=3&order=desc")
    );

    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [],
        count: 100,
        nextCursor: 3,
        prevCursor: 1,
        lastPage: 4,
      },
    });

    await act(async () => {
      render(<Transactions setTxnData={mockSetTxnData} />);
    });

    await waitFor(() => screen.getByTestId("prev"));
    fireEvent.click(screen.getByTestId("prev"));

    expect(mockPush).toHaveBeenCalled();
  });

  test("handles non-integer total pages calculation", async () => {
    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [],
        count: 25, // 25 / 10 = 2.5, should set totalPages to 3
        nextCursor: 1,
        prevCursor: 1,
        lastPage: 3,
      },
    });

    render(<Transactions setTxnData={mockSetTxnData} />);

    await waitFor(() => {
      expect(mockSetTxnData).toHaveBeenCalled();
    });
  });

  test("handles fetch error in catch block", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    getTransactions.mockRejectedValue(new Error("Network error"));

    await act(async () => {
      render(<Transactions setTxnData={mockSetTxnData} />);
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error while getting tx ",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  test("triggers fetchData on network change", async () => {
    useGetNetwork.mockReturnValue({
      isNetworkChanged: true,
    });

    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [],
        count: 10,
        nextCursor: 1,
        prevCursor: 1,
        lastPage: 1,
      },
    });

    render(<Transactions setTxnData={mockSetTxnData} />);

    await waitFor(() => {
      expect(mockSetTxnData).toHaveBeenCalled();
    });
  });

  test("triggers fetchData on order change", async () => {
    useSearchParams.mockReturnValue(
      new URLSearchParams("?page=1&id=1&order=asc")
    );

    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [],
        count: 10,
        nextCursor: 1,
        prevCursor: 1,
        lastPage: 1,
      },
    });

    render(<Transactions setTxnData={mockSetTxnData} />);

    await waitFor(() => {
      expect(mockSetTxnData).toHaveBeenCalled();
    });
  });

  test("handleLast navigates to last page", async () => {
    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [],
        count: 30, // totalPages = 3
        nextCursor: 2,
        prevCursor: 1,
        lastPage: 3,
      },
    });

    await act(async () => {
      render(<Transactions setTxnData={mockSetTxnData} />);
    });

    await waitFor(() => screen.getByTestId("last"));
    fireEvent.click(screen.getByTestId("last"));

    expect(mockPush).toHaveBeenCalledWith("?page=3&id=3&order=desc");
  });

  test("handleFirst navigates to first page", async () => {
    useSearchParams.mockReturnValue(
      new URLSearchParams("?page=2&id=2&order=desc")
    );

    getTransactions.mockResolvedValue({
      error: false,
      data: {
        transactions: [],
        count: 30,
        nextCursor: 3,
        prevCursor: 1,
        lastPage: 3,
      },
    });

    await act(async () => {
      render(<Transactions setTxnData={mockSetTxnData} />);
    });

    await waitFor(() => screen.getByTestId("first"));
    fireEvent.click(screen.getByTestId("first"));

    expect(mockPush).toHaveBeenCalledWith("?page=1&id=1&order=desc");
  });
});
