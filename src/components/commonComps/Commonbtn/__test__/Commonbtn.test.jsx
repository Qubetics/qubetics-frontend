import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CommonBtn from "./../Commonbtn";

// Mock styles.js
jest.mock("./../style", () => ({
  primaryButton: { padding: "10px", backgroundColor: "blue" },
  secondaryButton: { padding: "10px", backgroundColor: "gray" },
}));

describe("CommonBtn Component", () => {
  test("renders button with children text", () => {
    render(<CommonBtn>Click Me</CommonBtn>);
    expect(screen.getByRole("button")).toHaveTextContent("Click Me");
  });

  test("applies correct variant, color and size", () => {
    render(
      <CommonBtn variant="outlined" color="secondary" size="large">
        Test Btn
      </CommonBtn>
    );

    const buttonElement = screen.getByRole("button");

    expect(buttonElement).toHaveClass("MuiButton-outlined");
    expect(buttonElement).toHaveClass("MuiButton-sizeLarge");
  });

  test("calls onClick when clicked", () => {
    const handleClick = jest.fn();
    render(<CommonBtn onClick={handleClick}>Press</CommonBtn>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("does not call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <CommonBtn disabled onClick={handleClick}>
        Disabled Btn
      </CommonBtn>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test("renders startIcon", () => {
    render(
      <CommonBtn startIcon={<span data-testid="start-icon">S</span>}>
        Btn
      </CommonBtn>
    );

    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
  });

  test("renders endIcon", () => {
    render(
      <CommonBtn endIcon={<span data-testid="end-icon">E</span>}>Btn</CommonBtn>
    );

    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });

  test("merges customStyles with passed sx", () => {
    render(
      <CommonBtn color="primary" sx={{ margin: "20px" }}>
        Styled Btn
      </CommonBtn>
    );

    const btn = screen.getByRole("button");

    // MUI styles appear in style attribute after being merged
    expect(btn).toHaveStyle("margin: 20px");
    expect(btn).toHaveStyle("background-color: rgb(0, 0, 255)"); // from mocked styles.primaryButton
  });
});
