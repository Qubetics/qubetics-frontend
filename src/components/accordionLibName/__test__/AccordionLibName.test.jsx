import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import AccordionLibName from "../AccordionLibName";
import { useContractData } from "../../contexts/contractContext";

jest.mock("../../contexts/contractContext.js", () => ({
  useContractData: jest.fn(),
}));

jest.mock("../../../../public/SvgIcons", () => ({
  NextArrowIcon: () => <span data-testid="next-arrow" />,
}));
jest.mock(
  "../../customInput/CustomInput",
  () =>
    ({ value, onChange, label, placeholder }) =>
      (
        <input
          data-testid={label}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )
);

describe("AccordionLibName Component", () => {
  let mockSetInputs;
  let mockSetIsChecked;

  beforeEach(() => {
    mockSetInputs = jest.fn();
    mockSetIsChecked = jest.fn();
    useContractData.mockReturnValue({
      isChecked: false,
      setIsChecked: mockSetIsChecked,
      inputs: [{ libraryName: "", libraryAddress: "" }],
      setInputs: mockSetInputs,
    });
  });

  test("renders checkbox", () => {
    render(<AccordionLibName />);
    expect(screen.getByText("Add contract Library")).toBeInTheDocument();
  });

  test("checkbox toggles isChecked", () => {
    render(<AccordionLibName />);
    const checkbox = screen.getByRole("checkbox", { name: /Add contract Library/i });

    fireEvent.click(checkbox);
    expect(mockSetIsChecked).toHaveBeenCalledWith(true);
  });

  test("adds a new input box", () => {
    useContractData.mockReturnValueOnce({
      isChecked: true,
      setIsChecked: mockSetIsChecked,
      inputs: [{ libraryName: "", libraryAddress: "" }],
      setInputs: mockSetInputs,
    });

    render(<AccordionLibName />);
    const addButton = screen.getByText("+");
    fireEvent.click(addButton);
    expect(mockSetInputs).toHaveBeenCalled();
  });

  test("removes an input box", () => {
    useContractData.mockReturnValueOnce({
      isChecked: true,
      setIsChecked: mockSetIsChecked,
      inputs: [
        { libraryName: "A", libraryAddress: "0x1" },
        { libraryName: "B", libraryAddress: "0x2" },
      ],
      setInputs: mockSetInputs,
    });

    render(<AccordionLibName />);
    const removeButton = screen.getAllByText("-")[0];
    fireEvent.click(removeButton);
    expect(mockSetInputs).toHaveBeenCalled();
  });

  test("changes input values", () => {
    useContractData.mockReturnValueOnce({
      isChecked: true,
      setIsChecked: mockSetIsChecked,
      inputs: [{ libraryName: "", libraryAddress: "" }],
      setInputs: mockSetInputs,
    });

    render(<AccordionLibName />);
    const nameInput = screen.getByTestId("Library 0 name");
    fireEvent.change(nameInput, { target: { value: "MyLibrary" } });
    expect(mockSetInputs).toHaveBeenCalled();
  });
});