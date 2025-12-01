import { render, screen, fireEvent } from "@testing-library/react";
import { HexDEx } from "../HexDEx";
import { noExponentsValue } from "@/utils/commonFunctions";

jest.mock("../../customSelect/CustomSelect", () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <select data-testid="custom-select" onChange={(e) => onChange(e.target.value)}>
      <option value="hex">hex</option>
      <option value="dec">dec</option>
    </select>
  ),
}));

jest.mock("@/utils/commonFunctions", () => ({
  noExponentsValue: jest.fn(),
}));

describe("HexDEx Component", () => {
  const mockEvent = {
    name: "eventA",
    type: "uint256",
    value: "1000",
  };

  beforeEach(() => {
    noExponentsValue.mockImplementation((v) => v);
  });

  it("renders name and type", () => {
    render(<HexDEx event={mockEvent} index={0} />);
    expect(screen.getByText("eventA uint256")).toBeInTheDocument();
  });

  it("shows HEX value by default", () => {
    render(<HexDEx event={mockEvent} index={0} />);
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("changes display to DECIMAL when dropdown value changes", () => {
    render(<HexDEx event={mockEvent} index={0} />);
    fireEvent.change(screen.getByTestId("custom-select"), {
      target: { value: "dec" },
    });
    expect(noExponentsValue).toHaveBeenCalledWith(1000);
  });

  it("renders CustomSelect component", () => {
    render(<HexDEx event={mockEvent} index={0} />);
    expect(screen.getByTestId("custom-select")).toBeInTheDocument();
  });
});
