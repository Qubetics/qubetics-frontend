import React from "react";
import { render, screen } from "@testing-library/react";
import ContractDetails from "../ContractDetails";
import {
  InitStatus,
  FetchingStatus,
  SuccessStatus,
  Routes,
} from "@/constant/constant";

jest.mock("../../DoCopy/CopyText", () => ({
  __esModule: true,
  default: ({ text }) => <div data-testid="copy-text">{text}</div>,
}));

jest.mock("next/link", () => ({ children, href }) => (
  <a href={href}>{children}</a>
));

jest.mock("antd", () => ({
  Tooltip: ({ children }) => <div>{children}</div>,
}));

// Mock Loader + Page
jest.mock("../../loader/Loader", () => () => (
  <div data-testid="loader">Loading...</div>
));
jest.mock("@/app/(routes)/notfound/page", () => () => (
  <div data-testid="not-found">Not Found Page</div>
));

// Mock helpers
jest.mock("@/utils/commonFunctions", () => ({
  capitalizeWord: (v) => `Cap(${v})`,
  formatMillionNumber: (v) => v,
  noExponential: (v) => v,
}));

jest.mock("@/utils/getAddress", () => jest.fn((v) => `Short(${v})`));
jest.mock("@/utils/renderTime", () => ({
  convertToDateTime: jest.fn((v) => `Date(${v})`),
}));

describe("ContractDetails Component", () => {
  const mockData = {
    contractName: "mycontract",
    address: "0xABC123",
    contractType: "ERC20",
    balance: "2000000000000000000",
    creator: "0xCREATOR",
    updatedAt: "2024-01-01",
    createdAt: "2023-12-01",
    txCount: 12,
    txHash: "0xHASHVALUE",
  };

  test("renders Loader when status is loading", () => {
    render(<ContractDetails status={InitStatus} data={{}} />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  test("renders success details correctly", () => {
    render(<ContractDetails status={SuccessStatus} data={mockData} />);

    // Name
    expect(screen.getByText("Cap(mycontract)")).toBeInTheDocument();

    // Address shortened
    expect(screen.getByText("Short(0xABC123)")).toBeInTheDocument();

    // Contract Type
    expect(screen.getByText("ERC20")).toBeInTheDocument();

    // Balance
    expect(screen.getByText("2 TICS")).toBeInTheDocument();

    // Creator
    expect(screen.getByText("Short(0xCREATOR)")).toBeInTheDocument();

    // Dates converted
    expect(screen.getByText("Date(2024-01-01)")).toBeInTheDocument();
    expect(screen.getByText("Date(2023-12-01)")).toBeInTheDocument();

    // Transactions count
    expect(screen.getByText("12")).toBeInTheDocument();

    // TxHash
    expect(screen.getByText("Short(0xHASHVALUE)")).toBeInTheDocument();
  });

  test("renders NotFound Page when status is not success", () => {
    render(<ContractDetails status={"invalid"} data={{}} />);
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });
});
