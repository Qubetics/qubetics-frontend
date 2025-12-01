import { fireEvent, render, screen } from "@testing-library/react";
import CustomInput from "../CustomInput";

describe("CustomInput Component", () => {
  test("renders label and input correctly", () => {
    render(<CustomInput label="Username" placeholder="Enter name" onChange={() => {}} />);

    expect(screen.getByText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
  });

  test("calls onChange when typing", () => {
    const handleChange = jest.fn();
    render(<CustomInput label="Name" placeholder="Enter" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Enter");

    fireEvent.change(input, { target: { value: "Sachin" } });

    expect(handleChange).toHaveBeenCalledWith("Sachin");
  });

  test("placeholder clears on focus and returns on blur", () => {
    render(<CustomInput label="Email" placeholder="Enter Email" onChange={() => {}} />);

    const input = screen.getByPlaceholderText("Enter Email");

    // Focus → placeholder becomes empty
    fireEvent.focus(input);
    expect(input.placeholder).toBe("");

    // Blur → placeholder restored
    fireEvent.blur(input);
    expect(input.placeholder).toBe("Enter Email");
  });

  test("accepts extra props (...rest)", () => {
    render(
      <CustomInput
        label="Age"
        placeholder="Enter Age"
        type="number"
        data-testid="myInput"
        onChange={() => {}}
      />
    );

    const input = screen.getByTestId("myInput");

    expect(input).toHaveAttribute("type", "number");
  });
});
