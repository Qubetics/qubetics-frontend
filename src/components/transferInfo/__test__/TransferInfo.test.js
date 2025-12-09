import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TransferInfo from "./../TransferInfo";
import { useRouter, useSearchParams } from "next/navigation";

// ---------- MOCKS ----------
jest.mock("next/link", () => {
  return ({ href, children }) => <a href={href}>{children}</a>;
});

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock("../../DoCopy/CopyText", () => (props) => (
  <span data-testid="copy">{props.text}</span>
));

jest.mock("@/utils/commonFunctions", () => ({
  capitalizeWord: (x) => x,
  formatToTwoDecimals: (x) => x,
  formatMillionNumber: (x) => x,
  noExponential: (x) => x,
}));

jest.mock("@/utils/renderTime", () => ({
  convertToDateTime: () => "2024-01-01 12:00",
  renderTime: () => "5 secs ago",
}));

jest.mock("antd", () => ({
  Tooltip: ({ title, children }) => <span data-testid="tooltip">{children}</span>,
}));

jest.mock("@/assets/svg/svgs", () => () => <svg data-testid="icon" />);

jest.mock("@/constant/constant", () => ({
  EXPLORER_CURRENCY_NAME: "TICS",
}));

// ---------- TEST CASES ----------
describe("TransferInfo Component", () => {
  let mockRouterReplace;
  let mockSetTab;

  beforeEach(() => {
    mockRouterReplace = jest.fn();
    mockSetTab = jest.fn();

    useRouter.mockReturnValue({
      replace: mockRouterReplace,
    });

    useSearchParams.mockReturnValue({
      get: () => "1",
      toString: () => "tab=1",
    });
  });

  const mockData = {
    status: "SUCCESS",
    txhash: "0x123",
    fromAddress: "0xFrom",
    toAddress: "0xTo",
    blocknumber: "500",
    timestamp: "1700000000",
    value: "10",
    txFee: "0.0001",
    type: "transfer",
    gas: 21000,
  };

  const mockInternalTxns = [
    {
      method: "CALL",
      value: "1000000000000000000",
      fromAddress: "0xFromInt",
      toAddress: "0xToInt",
    },
  ];

  test("renders status, hash, from & to fields", () => {
    render(
      <TransferInfo
        data={mockData}
        internalTxns={[]}
        internalTxnCount={0}
        setTab={mockSetTab}
      />
    );

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("SUCCESS")).toBeInTheDocument();
    expect(screen.getAllByText("0x123")).toHaveLength(2); // hash and copy component
    expect(screen.getAllByText("0xFrom")).toHaveLength(2); // address and copy component
    expect(screen.getAllByText("0xTo")).toHaveLength(2); // address and copy component
  });

  test("renders internal transactions list", () => {
    render(
      <TransferInfo
        data={mockData}
        internalTxns={mockInternalTxns}
        internalTxnCount={1}
        setTab={mockSetTab}
      />
    );

    expect(screen.getByText("CALL")).toBeInTheDocument();
    expect(screen.getByText("1.000000 Tics")).toBeInTheDocument();
  });

  test("renders Block number", () => {
    render(
      <TransferInfo
        data={mockData}
        internalTxns={[]}
        internalTxnCount={0}
        setTab={mockSetTab}
      />
    );

    expect(screen.getAllByText("500")).toHaveLength(2); // block number and copy component
  });

  test("renders Amount tooltip", () => {
    render(
      <TransferInfo
        data={mockData}
        internalTxns={[]}
        internalTxnCount={0}
        setTab={mockSetTab}
      />
    );

    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
  });

  test("renders timestamp formatted", () => {
    render(
      <TransferInfo
        data={mockData}
        internalTxns={[]}
        internalTxnCount={0}
        setTab={mockSetTab}
      />
    );

    expect(screen.getByText(/2024-01-01 12:00/)).toBeInTheDocument();
    expect(screen.getByText("5 secs ago")).toBeInTheDocument();
  });

  test("handles More » button and router.replace call", () => {
    render(
      <TransferInfo
        data={mockData}
        internalTxns={mockInternalTxns}
        internalTxnCount={99}
        setTab={mockSetTab}
      />
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockSetTab).toHaveBeenCalledWith("2");
    expect(mockRouterReplace).toHaveBeenCalled();
  });
});
