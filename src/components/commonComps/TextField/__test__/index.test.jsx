import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TextField from "../../TextField";

jest.mock("../../theme.js", () => ({
  typography: {
    body2: { fontSize: "14px" },
  },
}));

describe("Custom TextField Component", () => {
  test("renders TextField with label", () => {
    render(<TextField label="Username" />);

    const input = screen.getByLabelText("Username");
    expect(input).toBeInTheDocument();
  });

  test("applies maxlength correctly", () => {
    render(<TextField label="Bio" maxlength={50} />);

    const input = screen.getByLabelText("Bio");
    expect(input).toHaveAttribute("maxlength", "50");
  });

  test("applies paddingRight correctly", () => {
    render(<TextField label="Email" paddingRight="20px" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveStyle("padding-right: 20px");
  });

  test("renders error state when error prop passed", () => {
    render(
      <TextField
        label="Password"
        error
        helperText="Invalid password"
      />
    );

    const errorText = screen.getByText("Invalid password");
    expect(errorText).toBeInTheDocument();
  });

  test("allows typing text", async () => {
    const user = userEvent.setup();

    render(<TextField label="Message" maxlength={20} />);

    const input = screen.getByLabelText("Message");

    await user.type(input, "Hello World!");
    expect(input.value).toBe("Hello World!");
  });

  test("renders placeholder with custom styles", () => {
    render(<TextField label="City" placeholder="Enter city" />);

    const input = screen.getByPlaceholderText("Enter city");
    expect(input).toBeInTheDocument();
  });
});
