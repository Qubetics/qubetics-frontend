import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomSelect from "../CustomSelect";

// Mock Ant Design Select component
jest.mock("antd", () => {
  const MockSelect = ({ children, onChange, value, placeholder, defaultValue, getPopupContainer }) => {
    // Simulate getPopupContainer call for coverage
    if (getPopupContainer) {
      getPopupContainer({ parentNode: 'mockParent' });
    }
    return (
      <div data-testid="mock-select">
        <div data-testid="select-value">{value || placeholder || defaultValue}</div>
        <select
          data-testid="native-select"
          onChange={(e) => onChange(e.target.value)}
          value={value || defaultValue || ""}
        >
          {children}
        </select>
      </div>
    );
  };
  MockSelect.Option = ({ children, value }) => (
    <option value={value}>{children}</option>
  );
  return { Select: MockSelect };
});

describe("CustomSelect Component", () => {
  const mockOptions = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
  ];

  it("renders label correctly", () => {
    render(
      <CustomSelect
        label="Test Label"
        options={mockOptions}
        onChange={() => { }}
      />
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders placeholder when no value is selected", () => {
    render(
      <CustomSelect
        label="Test"
        placeholder="Select an option"
        options={mockOptions}
        onChange={() => { }}
      />
    );
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("renders options correctly", () => {
    render(
      <CustomSelect
        label="Test"
        options={mockOptions}
        onChange={() => { }}
      />
    );
    // Since we mocked Select as a native select, options should be rendered as <option>
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("calls onChange when an option is selected", () => {
    const handleChange = jest.fn();
    render(
      <CustomSelect
        label="Test"
        options={mockOptions}
        onChange={handleChange}
      />
    );

    const select = screen.getByTestId("native-select");
    fireEvent.change(select, { target: { value: "opt2" } });

    expect(handleChange).toHaveBeenCalledWith("opt2");
  });

  it("displays the correct value when controlled", () => {
    render(
      <CustomSelect
        label="Test"
        options={mockOptions}
        value="opt1"
        onChange={() => { }}
      />
    );
    expect(screen.getByTestId("select-value")).toHaveTextContent("opt1");
  });

  it("uses defaultValue if provided", () => {
    render(
      <CustomSelect
        label="Test"
        options={mockOptions}
        defaultValue="opt2"
        onChange={() => { }}
      />
    );
    expect(screen.getByTestId("select-value")).toHaveTextContent("opt2");
  });
});
