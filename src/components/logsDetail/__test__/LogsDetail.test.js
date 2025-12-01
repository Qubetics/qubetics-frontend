import { render, screen, fireEvent } from "@testing-library/react";
import LogsDetail from "../LogsDetail";
import { noExponentsValue } from "@/utils/commonFunctions";
import { LogsOption } from "@/constant/dropDownConstant";

jest.mock("../../customSelect/CustomSelect", () => {
  return function CustomSelect({ onChange }) {
    return (
      <select data-testid="custom-select" onChange={(e) => onChange(e.target.value)}>
        <option value="hex">hex</option>
        <option value="dec">dec</option>
      </select>
    );
  };
});

jest.mock("../HexDEx", () => ({
  HexDEx: ({ event }) => <p data-testid="hexdex">{event.name}</p>,
}));

jest.mock("next/link", () => {
  return function Link({ children, href }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("@/utils/commonFunctions", () => ({
  noExponentsValue: jest.fn(),
}));

describe("LogsDetail Component", () => {
  const mockProps = {
    topics: ["0xabc", "10"],
    index: 0,
    contractLogs: {
      address: "0x12345",
      name: "TestLog",
      events: [
        { name: "eventA", type: "uint", value: "20" },
        { name: "value", type: "uint", value: "0x50" },
      ],
    },
  };

  beforeEach(() => {
    noExponentsValue.mockImplementation((v) => v);
  });

  it("renders address", () => {
    render(<LogsDetail {...mockProps} />);
    expect(screen.getByText("0x12345")).toBeInTheDocument();
  });

  it("renders name from getName()", () => {
    render(<LogsDetail {...mockProps} />);
    expect(screen.getByText(/TestLog/i)).toBeInTheDocument();
  });

  it("renders topics in hex by default", () => {
    render(<LogsDetail {...mockProps} />);
    expect(screen.getByText(/\[topic0\]/)).toBeInTheDocument();
    expect(screen.getByText(/0xabc/)).toBeInTheDocument();
  });

  it("switches topics to decimal when dropdown changes", () => {
    render(<LogsDetail {...mockProps} />);
    fireEvent.change(screen.getByTestId("custom-select"), { target: { value: "dec" } });
    expect(noExponentsValue).toHaveBeenCalled();
  });

  it("renders HexDEx for non-value events", () => {
    render(<LogsDetail {...mockProps} />);
    expect(screen.getByTestId("hexdex")).toHaveTextContent("eventA");
  });

  it("renders value field correctly", () => {
    render(<LogsDetail {...mockProps} />);
    expect(screen.getByText("80")).toBeInTheDocument(); // Number("0x50") = 80
  });

  it("renders '-' when index !== 0", () => {
    render(<LogsDetail {...mockProps} index={1} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
