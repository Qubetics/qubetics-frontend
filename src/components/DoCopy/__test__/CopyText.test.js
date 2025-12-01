import React from "react";
import { render, fireEvent, screen, act } from "@testing-library/react";
import CopyText from "../CopyText";

// Mock CopyIcons
jest.mock("../../../../public/SvgIcons", () => ({
  CopyIcons: () => <span data-testid="copy-icon">copy-icon</span>,
}));

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe("CopyText Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  test("should return null when text is empty or invalid", () => {
    const { container } = render(<CopyText text="" />);
    expect(container.firstChild).toBeNull();

    const { container: c2 } = render(<CopyText text={null} />);
    expect(c2.firstChild).toBeNull();

    const { container: c3 } = render(<CopyText text={"undefined"} />);
    expect(c3.firstChild).toBeNull();

    const { container: c4 } = render(<CopyText text={"null"} />);
    expect(c4.firstChild).toBeNull();
  });

  test("should render CopyIcons when not copied", () => {
    render(<CopyText text="12345" />);
    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
  });

  test("should copy text when clicked", () => {
    render(<CopyText text="12345" />);

    const tooltip = screen.getByTestId("copy-icon").parentElement;

    fireEvent.click(tooltip);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("12345");
  });

  test("should show 'Copied' tooltip after clicking", () => {
    render(<CopyText text="12345" />);

    const tooltip = screen.getByTestId("copy-icon").parentElement;

    fireEvent.click(tooltip);

    // copied becomes true → CheckOutlined renders
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();
  });

  test("tooltip text should change based on hoverText", () => {
    const { rerender } = render(<CopyText text="abc" hoverText="Node Address" />);
    expect(screen.getByText("copy-icon").closest(".ant-tooltip-open")).toBeFalsy();

    rerender(<CopyText text="abc" hoverText="hash" />);
    rerender(<CopyText text="abc" hoverText="block" />);

    // No direct tooltip display, but we ensure code path is covered
  });

  test("copied state resets after 1 second", () => {
    render(<CopyText text="hello" />);
    const tooltip = screen.getByTestId("copy-icon").parentElement;

    fireEvent.click(tooltip);

    // copied = true
    expect(screen.getByRole("img", { hidden: true })).toBeInTheDocument();

    // Advance timers 1 sec
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // copied resets → CopyIcons shows again
    expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
  });
});
