import { render, screen } from "@testing-library/react";
import TransactionAction from "./../TransectionAction";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock firstCapitalLetter
jest.mock("@/constant/constant", () => ({
  firstCapitalLetter: jest.fn((str) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : ""
  ),
}));

describe("TransactionAction Component", () => {
  const mockData = {
    input: JSON.stringify({
      name: "transfer",
    }),
    logs: JSON.stringify([
      {
        events: [
          { value: "0xFromAddress123" },
          { value: "0xToAddress456" },
          { value: "1000" },
        ],
      },
    ]),
    tokenInfo: {
      contractAddress: "0xContractABC",
      tokenName: "TestToken",
      tokenSymbol: "TTK",
    },
  };

  test("renders Transaction Type correctly", () => {
    render(<TransactionAction data={mockData} />);
    expect(screen.getByText("Transaction Type")).toBeInTheDocument();
    expect(screen.getByText("Transfer")).toBeInTheDocument(); // capitalized
  });

  test("renders Tokens Transferred", () => {
    render(<TransactionAction data={mockData} />);
    expect(screen.getByText("Tokens Transferred")).toBeInTheDocument();
    expect(screen.getByText("ERC-20")).toBeInTheDocument();
  });

  test("renders From address with correct link", () => {
    render(<TransactionAction data={mockData} />);

    const fromLink = screen.getByText("0xFromAddress123");
    expect(fromLink).toBeInTheDocument();
    expect(fromLink.getAttribute("href")).toBe("/address/0xFromAddress123");
  });

  test("renders To address with correct link", () => {
    render(<TransactionAction data={mockData} />);

    const toLink = screen.getByText("0xToAddress456");
    expect(toLink).toBeInTheDocument();
    expect(toLink.getAttribute("href")).toBe("/address/0xToAddress456");
  });

  test("renders Value correctly", () => {
    render(<TransactionAction data={mockData} />);
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  test("renders Token Name with correct link", () => {
    render(<TransactionAction data={mockData} />);

    const nameLink = screen.getByText("TestToken");
    expect(nameLink).toBeInTheDocument();
    expect(nameLink.getAttribute("href")).toBe(
      "/contract/0xContractABC"
    );
  });

  test("renders Token Symbol", () => {
    render(<TransactionAction data={mockData} />);
    expect(screen.getByText("(TTK)")).toBeInTheDocument();
  });

  test("does not render when logs are invalid JSON", () => {
    const badData = { ...mockData, logs: "invalid" };

    // Mock JSON.parse to return null for invalid JSON
    const originalParse = JSON.parse;
    JSON.parse = jest.fn((str) => {
      if (str === "invalid") return null;
      return originalParse(str);
    });

    render(<TransactionAction data={badData} />);

    // Should render nothing because JSON.parse returns null → isDataExits = null
    expect(screen.queryByText("Transaction Type")).not.toBeInTheDocument();

    // Restore original JSON.parse
    JSON.parse = originalParse;
  });
});
