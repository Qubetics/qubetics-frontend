import React from "react";
import { render, screen } from "@testing-library/react";
import TransactionDetails from "../TransactionDetails";
import { EXPLORER_CURRENCY_NAME } from "@/constant/constant";
import { convertToDateTime } from "@/utils/renderTime";
import { noExponential } from "@/utils/commonFunctions";

// Mock next/link
jest.mock("next/link", () => ({ children, href }) => (
  <a href={href}>{children}</a>
));

// Mock CopyText
jest.mock("../../DoCopy/CopyText", () => ({ text }) => (
  <button data-testid="copy-btn">{text}</button>
));

// Mock constant
jest.mock("@/constant/constant", () => ({
  EXPLORER_CURRENCY_NAME: "TICS",
}));

// Mock utils
jest.mock("@/utils/renderTime", () => ({
  convertToDateTime: jest.fn((x) => `formatted-${x}`),
}));

jest.mock("@/utils/commonFunctions", () => ({
  capitalizeWord: jest.fn((x) => `Cap-${x}`),
  noExponential: jest.fn((x) => `${x}`),
}));

describe("TransactionDetails Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // mock window + localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
      },
      writable: true,
    });
  });

  const mockData = {
    timestamp: 123456,
    txFee: "10000",
    type: "transfer",
    gas: "50000",
    fromAddress: "0xSender",
    tokenInfo: { tokenSymbol: "ABC" },
    input: JSON.stringify({
      name: "transfer",
      params: [{ value: "0xReceiver" }, { value: "250" }],
    }),
  };

  test("renders timestamp using convertToDateTime", () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    render(<TransactionDetails data={mockData} />);

    expect(convertToDateTime).toHaveBeenCalledWith(mockData.timestamp);
    expect(
      screen.getByText(`formatted-${mockData.timestamp}`)
    ).toBeInTheDocument();
  });

  test("renders fee correctly", () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    render(<TransactionDetails data={mockData} />);

    expect(noExponential).toHaveBeenCalled();
    expect(screen.getByText("10000 TICS")).toBeInTheDocument();
  });

  test("renders method correctly", () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    render(<TransactionDetails data={mockData} />);

    expect(screen.getByText("Cap-transfer")).toBeInTheDocument();
  });

  test("shows gas used only when chain = EVM Chain", () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    render(<TransactionDetails data={mockData} />);

    expect(screen.getByText("Gas Used")).toBeInTheDocument();
    expect(screen.getByText("50000")).toBeInTheDocument();
  });

  test("does NOT show gas used when chain is NOT EVM Chain", () => {
    window.localStorage.getItem.mockReturnValue("Non-EVM");

    render(<TransactionDetails data={mockData} />);

    expect(screen.queryByText("Gas Used")).not.toBeInTheDocument();
  });

  test("renders token transfer info when input.name = transfer", () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    render(<TransactionDetails data={mockData} />);

    // Sender Link and Button
    expect(screen.getAllByText("0xSender").length).toBe(2);

    // Receiver Link and Button
    expect(screen.getAllByText("0xReceiver").length).toBe(2);

    // Amount
    expect(screen.getByText("250")).toBeInTheDocument();

    // Symbol
    expect(screen.getByText("ABC")).toBeInTheDocument();

    // Copy buttons
    expect(screen.getAllByTestId("copy-btn").length).toBe(2);
  });

  test("renders '-' if timestamp and createdAt missing", () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    const noTimeData = { ...mockData, timestamp: null, createdAt: null };

    render(<TransactionDetails data={noTimeData} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  test("renders 0 fee when txFee missing", () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    const noFeeData = { ...mockData, txFee: null };

    render(<TransactionDetails data={noFeeData} />);

    expect(screen.getByText(`0 ${EXPLORER_CURRENCY_NAME}`)).toBeInTheDocument();
  });

  test("does not render token section when input.name != transfer", () => {
    window.localStorage.getItem.mockReturnValue("EVM Chain");

    const diffInput = {
      ...mockData,
      input: JSON.stringify({ name: "approve" }),
    };

    render(<TransactionDetails data={diffInput} />);

    expect(screen.queryByText("Tokens transferred")).not.toBeInTheDocument();
  });
});
