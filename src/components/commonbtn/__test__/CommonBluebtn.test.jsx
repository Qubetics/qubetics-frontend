import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Commonbtn from "./../CommonBluebtn";

describe("Commonbtn Component", () => {
  test("renders button with correct text", () => {
    render(<Commonbtn text="Click Me" />);
    expect(screen.getByRole("button")).toHaveTextContent("Click Me");
  });

  test("applies correct button type", () => {
    render(<Commonbtn text="Submit" type="submit" />);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  test("calls onClick when button is clicked", () => {
    const handleClick = jest.fn();
    render(<Commonbtn text="Click" onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does NOT call onClick when button is disabled", () => {
    const handleClick = jest.fn();
    render(<Commonbtn text="Disabled" onClick={handleClick} disabled />);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  test("applies custom className along with default class", () => {
    render(<Commonbtn text="Styled" className="custom-class" />);

    expect(screen.getByRole("button")).toHaveClass("custom-class");
    expect(screen.getByRole("button")).toHaveClass("bluebtn"); // default class
  });

  test("applies inline styles correctly", () => {
    const styleObj = { backgroundColor: "red" };

    render(<Commonbtn text="Styled Btn" style={styleObj} />);

    expect(screen.getByRole("button")).toHaveStyle(
      "background-color: rgb(255, 0, 0)"
    );
  });
});
