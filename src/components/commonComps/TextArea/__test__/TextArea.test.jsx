import { render, screen } from "@testing-library/react";
import TextArea from "../TextArea";
import userEvent from "@testing-library/user-event";

describe("TextArea Component", () => {
  test("renders TextArea with default rows=4", () => {
    render(<TextArea label="Description" />);
    
    const input = screen.getByLabelText("Description");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("rows", "4");
  });

  test("renders TextArea with custom rows", () => {
    render(<TextArea label="Message" rows={6} />);
    
    const input = screen.getByLabelText("Message");
    expect(input).toHaveAttribute("rows", "6");
  });

  test("applies maxLength to textarea", () => {
    render(<TextArea label="Comment" maxlength={100} />);
    
    const input = screen.getByLabelText("Comment");
    expect(input).toHaveAttribute("maxlength", "100");
  });

  test("renders error state when error prop passed", () => {
    render(<TextArea label="Details" error helperText="Required field" />);
    
    const errorText = screen.getByText("Required field");
    expect(errorText).toBeInTheDocument();
  });

  test("allows typing text", async () => {
    const user = userEvent.setup();
    render(<TextArea label="Notes" maxlength={20} />);

    const input = screen.getByLabelText("Notes");
    await user.type(input, "Hello World");

    expect(input.value).toBe("Hello World");
  });
});
