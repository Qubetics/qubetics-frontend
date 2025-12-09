import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomCheckbox from "../CustomCheckbox";

describe("CustomCheckbox Component", () => {
  test("renders checkbox with provided label", () => {
    render(<CustomCheckbox label="Accept Terms" checked={false} />);
    expect(screen.getByText("Accept Terms")).toBeInTheDocument();
  });

  test("checkbox reflects checked state", () => {
    render(<CustomCheckbox label="Test" checked={true} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  test("calls onChange when clicked", () => {
    const handleChange = jest.fn();
    render(
      <CustomCheckbox
        label="Check Me"
        checked={false}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("disables checkbox when disabled prop is true", () => {
    render(<CustomCheckbox label="Disabled" checked={false} disabled />);
    const checkbox = screen.getByRole("checkbox");

    expect(checkbox).toBeDisabled();
  });

  test("adds disabled class when disabled", () => {
    const { container } = render(
      <CustomCheckbox label="Test" checked={false} disabled />
    );

    expect(container.firstChild).toHaveClass("disabled");
  });

  test("label is correctly linked to checkbox using htmlFor + id", () => {
    render(<CustomCheckbox label="OptionA" checked={false} />);

    const checkbox = screen.getByRole("checkbox");
    const label = screen.getByText("OptionA").closest("label");

    expect(label).toHaveAttribute("for", "checkbox-OptionA");
    expect(checkbox).toHaveAttribute("id", "checkbox-OptionA");
  });
});
