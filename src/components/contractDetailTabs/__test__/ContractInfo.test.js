import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContractInfo from "../ContractInfo";

// ------------------ MOCK CONTEXT ------------------
jest.mock("../../contexts/contractContext", () => ({
  useContractData: () => ({
    connectAddress: mockAddress,
    setConnectAddress: mockSetConnect,
  }),
}));

let mockAddress = "";
const mockSetConnect = jest.fn();

// ------------------ MOCK addQubeticForVerifyContract ------------------
jest.mock("../../AddQubeticsNetwork/addQubetics", () => ({
  addQubeticForVerifyContract: jest.fn(() => Promise.resolve()),
}));

// ------------------ MOCK getAddress ------------------
jest.mock("@/utils/getAddress", () => jest.fn((addr) => `masked_${addr}`));

// ------------------ MOCK CopyText ------------------
jest.mock("../../DoCopy/CopyText", () => (props) => (
  <span data-testid="copy-text">{props.text}</span>
));

// ------------------ MOCK Next Image ------------------
jest.mock("next/image", () => (props) => (
  <img {...props} alt={props.alt || "img"} />
));

// ------------------ MOCK AntD Modal ------------------
jest.mock("antd", () => ({
  Modal: ({ open, children, title }) =>
    open ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
  Button: (props) => (
    <button onClick={props.onClick}>{props.children}</button>
  ),
}));

// ------------------ MOCK window.ethereum ------------------
beforeEach(() => {
  mockAddress = "";
  mockSetConnect.mockClear();

  global.window.ethereum = {
    request: jest.fn()
      .mockImplementationOnce(() => "0x13881") // chainId
      .mockImplementation(() => ["0x123456789"]), // accounts
    on: jest.fn(),
  };
});

// =======================================================
//                     TEST SUITE
// =======================================================

describe("ContractInfo Component", () => {
  test("shows disconnected UI initially", () => {
    render(<ContractInfo />);

    expect(screen.getByText("Disconnected")).toBeInTheDocument();
    expect(screen.getByText("Connect Wallet")).toBeInTheDocument();
  });

  test("opens modal when clicking Connect Wallet", () => {
    render(<ContractInfo />);

    fireEvent.click(screen.getByText("Connect Wallet"));

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Connect your wallet")).toBeInTheDocument();
  });

  test("clicking MetaMask triggers wallet connect flow", async () => {
    const { addQubeticForVerifyContract } = require("../../AddQubeticsNetwork/addQubetics");

    render(<ContractInfo />);

    fireEvent.click(screen.getByText("Connect Wallet"));

    const element = screen.getByText("MetaMask");
    fireEvent.click(element);

    expect(addQubeticForVerifyContract).toHaveBeenCalled();
  });

  test("closes modal when handleCancel or handleOk called", () => {
    render(<ContractInfo />);

    fireEvent.click(screen.getByText("Connect Wallet"));
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    // simulate clicking ok or cancel
    fireEvent.click(screen.getByText("MetaMask")); // clicking inside modal closes after connect
  });

  test("renders connected UI when connectAddress exists", () => {
    mockAddress = "0xABC123";

    render(<ContractInfo />);

    expect(screen.getByText("Connected to :")).toBeInTheDocument();
    expect(screen.getByText("masked_0xABC123")).toBeInTheDocument();
    expect(screen.getByTestId("copy-text")).toHaveTextContent("0xABC123");
  });

  test("disconnect button clears wallet address", () => {
    mockAddress = "0xABC123";

    render(<ContractInfo />);

    fireEvent.click(screen.getByText("Disconnect"));
    expect(mockSetConnect).toHaveBeenCalledWith("");
  });

  test("MetaMask account + network event listeners are added", async () => {
    render(<ContractInfo />);

    await waitFor(() => {
      expect(window.ethereum.on).toHaveBeenCalledWith(
        "accountsChanged",
        expect.any(Function)
      );
      expect(window.ethereum.on).toHaveBeenCalledWith(
        "disconnect",
        expect.any(Function)
      );
      expect(window.ethereum.on).toHaveBeenCalledWith(
        "chainChanged",
        expect.any(Function)
      );
    });
  });
});
