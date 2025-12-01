import { render, screen } from "@testing-library/react";
import MessageInfo from "../MessageInfo";

jest.mock("next/link", () => ({ children, href }) => <a href={href}>{children}</a>);
jest.mock("../../DoCopy/CopyText", () => props => <span data-testid="copy">{props.text}</span>);
jest.mock("@/utils/commonFunctions", () => ({
  capitalizeWord: v => v,
  noExponential: v => v,
}));
jest.mock("@/utils/renderTime", () => ({
  convertToDateTime: () => "01/01/2024",
  renderTime: () => "2s ago",
}));
jest.mock("@/constant/constant", () => ({
  EXPLORER_CURRENCY_NAME: "QTC",
}));

describe("MessageInfo", () => {
  const mockData = {
    status: "SUCCESS",
    txhash: "0xabc123",
    fromAddress: "0xfrom",
    toAddress: "0xto",
    blocknumber: "100",
    value: "10",
    timestamp: 1700000000,
    txFee: "2",
    type: "transfer",
    gas: 21000,
  };

  test("renders all basic fields", () => {
    render(<MessageInfo data={mockData} />);
    expect(screen.getByText("SUCCESS")).toBeInTheDocument();
    expect(screen.getAllByText("0xabc123").length).toBeGreaterThan(0);
    expect(screen.getAllByText("0xfrom").length).toBeGreaterThan(0);
    expect(screen.getAllByText("0xto").length).toBeGreaterThan(0);
    expect(screen.getAllByText("100").length).toBeGreaterThan(0);
    expect(screen.getByText("10 QTC")).toBeInTheDocument();
    expect(screen.getByText("2 QTC")).toBeInTheDocument();
    expect(screen.getByText("transfer")).toBeInTheDocument();
    expect(screen.getByText("21000")).toBeInTheDocument();
  });

  test("renders FAILED status", () => {
    render(<MessageInfo data={{ ...mockData, status: "FAILED" }} />);
    expect(screen.getByText("FAILED")).toBeInTheDocument();
  });

  test("fallback when no timestamp but createdAt exists", () => {
    render(<MessageInfo data={{ ...mockData, timestamp: null, createdAt: 1700000000 }} />);
    expect(screen.getByText("01/01/2024")).toBeInTheDocument();
    expect(screen.getByText("2s ago")).toBeInTheDocument();
  });

  test("renders CopyText for all applicable fields", () => {
    render(<MessageInfo data={mockData} />);
    const copyItems = screen.getAllByTestId("copy");
    expect(copyItems.length).toBeGreaterThan(1);
  });

  test("renders contractAddress when toAddress missing", () => {
    render(
      <MessageInfo
        data={{
          ...mockData,
          toAddress: "",
          contractAddress: "0xcontract",
        }}
      />
    );
    expect(screen.getAllByText("0xcontract").length).toBeGreaterThan(0);
  });

  test("renders '-' when fields missing", () => {
    render(<MessageInfo data={{}} />);
    expect(screen.getAllByText("-").length).toBeGreaterThan(3);
  });
});
