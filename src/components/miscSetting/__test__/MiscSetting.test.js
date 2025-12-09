import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MiscSetting from "../MiscSetting";

// Mock CustomInput and CustomSelect to avoid rendering complexity
jest.mock("../../customInput/CustomInput", () => (props) => (
  <div>
    {props.label}
    <input
      data-testid="custom-input"
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
));

jest.mock("../../customSelect/CustomSelect", () => (props) => (
  <select
    data-testid="custom-select"
    onChange={(e) => props.onChange(e.target.value)}
    defaultValue={props.defaultValue}
  >
    {props.options.map((op) => (
      <option key={op.value} value={op.value}>
        {op.label}
      </option>
    ))}
  </select>
));

// Mock Context
const mockContext = {
  runsOptimizer: "200",
  setRunsOptimizer: jest.fn(),
  runsCheck: true,
  setRunCheck: jest.fn(),
  formData: {},
  EVMVersion: "london",
  setEVMVersion: jest.fn(),
};

jest.mock("../../contexts/contractContext", () => ({
  useContractData: () => mockContext,
}));

describe("MiscSetting Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders input when runsCheck = true", () => {
    render(<MiscSetting />);

    const input = screen.getByTestId("custom-input");
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("200");
  });

  test("updates runsOptimizer when typing", () => {
    render(<MiscSetting />);

    const input = screen.getByTestId("custom-input");
    fireEvent.change(input, { target: { value: "500" } });

    expect(mockContext.setRunsOptimizer).toHaveBeenCalledWith("500");
  });

  test("checkbox toggles runsCheck", () => {
    render(<MiscSetting />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockContext.setRunCheck).toHaveBeenCalledWith(!mockContext.runsCheck);
  });

  test("renders EVM Version select and changes value", () => {
    render(<MiscSetting />);

    const select = screen.getByTestId("custom-select");
    fireEvent.change(select, { target: { value: "shanghai" } });

    expect(mockContext.setEVMVersion).toHaveBeenCalledWith("shanghai");
  });
});
