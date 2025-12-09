import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomControl from "./../CustomControl";

describe("CustomControl Component", () => {
  test("renders input and label correctly", () => {
    render(
      <CustomControl
        type="radio"
        id="option1"
        name="group"
        value="1"
        label="Option 1"
      />
    );

    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByRole("radio")).toBeInTheDocument();
  });

  test("input receives correct props", () => {
    render(
      <CustomControl
        type="checkbox"
        id="check1"
        name="accept"
        value="yes"
        checked={true}
        label="Accept"
      />
    );

    const input = screen.getByRole("checkbox");

    expect(input).toBeChecked();
    expect(input).toHaveAttribute("id", "check1");
    expect(input).toHaveAttribute("name", "accept");
    expect(input).toHaveAttribute("value", "yes");
  });

  test("calls onChange when input is clicked", () => {
    const handleChange = jest.fn();

    render(
      <CustomControl
        type="checkbox"
        id="agree"
        name="terms"
        value="yes"
        checked={false}
        onChange={handleChange}
        label="Agree"
      />
    );

    fireEvent.click(screen.getByRole("checkbox"));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("label is linked to input using htmlFor and id", () => {
    render(
      <CustomControl
        type="radio"
        id="radio-123"
        name="choice"
        value="123"
        label="Choose Me"
      />
    );

    const input = screen.getByRole("radio");
    const label = screen.getByText("Choose Me");

    expect(label).toHaveAttribute("for", "radio-123");
    expect(input).toHaveAttribute("id", "radio-123");
  });
});
