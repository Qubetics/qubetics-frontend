import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import WriteContent from "../WriteContent";

// Mocks
jest.mock("../../contexts/contractContext", () => ({
  useContractData: () => ({
    connectAddress: "0x12345",
  }),
}));

jest.mock("../ContractInfo", () => () => <div>ContractInfo</div>);
jest.mock("../../loader/Loader", () => () => <div>Loading...</div>);
jest.mock("web3", () => {
  return jest.fn().mockImplementation(() => ({
    eth: {
      Contract: jest.fn().mockImplementation(() => ({
        methods: {
          testFunction: jest.fn(() => ({
            send: jest.fn().mockResolvedValue({
              transactionHash: "0xABC",
            }),
          })),
        },
      })),
    },
  }));
});

// Mock convertArray + createTupleObject
jest.mock("@/constant/constant", () => ({
  convertArray: jest.fn((x) => Object.values(x)),
  createTupleObject: jest.fn((x) => x),
}));

describe("WriteContent Component", () => {
  const abi = JSON.stringify([
    {
      name: "testFunction",
      type: "function",
      stateMutability: "nonpayable",
      inputs: [{ name: "amount", type: "uint256" }],
      outputs: [{ type: "bool" }],
    },
  ]);

  const hash = "0xContractHash";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders ContractInfo and Collapse", () => {
    render(<WriteContent abiData={abi} hash={hash} />);
    expect(screen.getByText("ContractInfo")).toBeInTheDocument();
  });

  test("renders write function accordion", async () => {
    render(<WriteContent abiData={abi} hash={hash} />);

    // Accordion label (LinkChain icon is mocked by default)
    expect(screen.getByText("1. testFunction")).toBeInTheDocument();
  });

  test("renders input field for function params", async () => {
    render(<WriteContent abiData={abi} hash={hash} />);

    fireEvent.click(screen.getByText("1. testFunction"));

    expect(screen.getByPlaceholderText("uint256")).toBeInTheDocument();
  });

  test("shows validation errors when clicking Write with empty input", async () => {
    render(<WriteContent abiData={abi} hash={hash} />);

    fireEvent.click(screen.getByText("1. testFunction"));
    fireEvent.click(screen.getByText("Write"));

    expect(screen.getByText("Please enter amount")).toBeInTheDocument();
  });

  test("calls Web3 write method when inputs are valid", async () => {
    window.ethereum = {
      request: jest.fn().mockResolvedValue(true),
      selectedAddress: "0x111",
    };

    const { findByText, getByPlaceholderText } = render(
      <WriteContent abiData={abi} hash={hash} />
    );

    fireEvent.click(screen.getByText("1. testFunction"));

    const input = getByPlaceholderText("uint256");
    fireEvent.change(input, { target: { value: "10" } });

    fireEvent.click(screen.getByText("Write"));

    expect(await findByText("Loading...")).toBeInTheDocument();
  });

  test("shows error if MetaMask (window.ethereum) not available", async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    delete window.ethereum;

    render(<WriteContent abiData={abi} hash={hash} />);

    fireEvent.click(screen.getByText("1. testFunction"));

    fireEvent.click(screen.getByText("Write"));

    expect(consoleSpy).toHaveBeenCalledWith("MetaMask not installed");
    consoleSpy.mockRestore();
  });
});
