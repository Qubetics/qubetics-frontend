import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TokenTransactions from "../TokenTransactions";
import tokenTransaction from "@/services/tokenTransaction";
import { useParams } from "next/navigation";
import { useGetNetwork } from "../../contexts/networkChanged";
import {
  InitStatus,
  FetchingStatus,
  SuccessStatus,
  ErrorStatus,
} from "@/constant/constant";

jest.mock("@/services/tokenTransaction");
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
}));
jest.mock("../../contexts/networkChanged", () => ({
  useGetNetwork: jest.fn(),
}));
jest.mock("../../SkeletonTableWrapper/SkeletonTableWrapper", () => ({
  SkeletonTableWrapper: ({ dataSource }) => (
    <div data-testid="table">{dataSource?.length} rows</div>
  ),
}));
jest.mock("../../Pagination/Pagination", () => (props) => (
  <div>
    <button data-testid="first" onClick={props.handleFirst}>
      First
    </button>
    <button data-testid="prev" onClick={props.handlePrevious}>
      Prev
    </button>
    <button data-testid="next" onClick={props.handleNext}>
      Next
    </button>
    <button data-testid="last" onClick={props.handleLast}>
      Last
    </button>
  </div>
));

describe("TokenTransactions Component", () => {
  let setTokensTxData;

  const mockResponse = {
    data: {
      tokens: [{ id: 1 }, { id: 2 }],
      total_count: 40, // 40 / tableLimit(10) = 4 pages
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    setTokensTxData = jest.fn();

    tokenTransaction.mockResolvedValue(mockResponse);

    useParams.mockReturnValue({
      addressDetail: "0x123",
    });

    useGetNetwork.mockReturnValue({
      isNetworkChanged: false,
    });
  });

  test("renders and fetches data on mount", async () => {
    const { rerender } = render(
      <TokenTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />
    );

    expect(tokenTransaction).toHaveBeenCalledWith("0x123", 1);

    await waitFor(() => {
      expect(setTokensTxData).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
    });

    rerender(
      <TokenTransactions
        setTokensTxData={setTokensTxData}
        tokensTxData={[{ id: 1 }, { id: 2 }]}
      />
    );

    expect(screen.getByTestId("table")).toHaveTextContent("2 rows");
  });

  test("shows pagination when totalPages > 1", async () => {
    render(
      <TokenTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />
    );

    await waitFor(() => {
      expect(screen.getByTestId("next")).toBeInTheDocument();
    });
  });

  test("next button increases page and refetches", async () => {
    render(
      <TokenTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />
    );

    await waitFor(() => {});

    fireEvent.click(screen.getByTestId("next"));

    await waitFor(() => {
      expect(tokenTransaction).toHaveBeenCalledWith("0x123", 2);
    });
  });

  test("previous button decreases page", async () => {
    render(
      <TokenTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />
    );

    await waitFor(() => {});

    fireEvent.click(screen.getByTestId("next")); // page 2
    fireEvent.click(screen.getByTestId("prev")); // back to page 1

    await waitFor(() => {
      expect(tokenTransaction).toHaveBeenCalledWith("0x123", 1);
    });
  });

  test("first button goes to page 1", async () => {
    render(
      <TokenTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />
    );

    await waitFor(() => {});

    fireEvent.click(screen.getByTestId("next")); // page → 2
    fireEvent.click(screen.getByTestId("first")); // page → 1

    await waitFor(() => {
      expect(tokenTransaction).toHaveBeenCalledWith("0x123", 1);
    });
  });

  test("last button goes to last page", async () => {
    render(
      <TokenTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />
    );

    await waitFor(() => {});

    fireEvent.click(screen.getByTestId("last")); // Should go to page 4

    await waitFor(() => {
      expect(tokenTransaction).toHaveBeenCalledWith("0x123", 4);
    });
  });

  test("refetches when network changes", async () => {
    useGetNetwork.mockReturnValue({
      isNetworkChanged: true,
    });

    render(
      <TokenTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />
    );

    await waitFor(() => {
      expect(tokenTransaction).toHaveBeenCalledTimes(2); // mount + network change
    });
  });

  test("handles API error", async () => {
    tokenTransaction.mockRejectedValueOnce(new Error("API error"));

    render(
      <TokenTransactions setTokensTxData={setTokensTxData} tokensTxData={[]} />
    );

    await waitFor(() => {
      expect(setTokensTxData).not.toHaveBeenCalled();
    });
  });
});
