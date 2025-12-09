import React from "react";
import { render, screen } from "@testing-library/react";
import { truncateWithTooltip } from "@/components/commonComps/truncateWithTooltip/truncateWithTooltip";
import { Tooltip } from "antd";

// Mock truncateString
jest.mock("@/utils/commonFunctions", () => ({
  truncateString: jest.fn(() => "TRUNCATED_VALUE"),
}));

// Mock Tooltip to avoid AntD DOM issues
jest.mock("antd", () => ({
  Tooltip: ({ title, children }) => (
    <div data-testid="tooltip" data-title={title}>
      {children}
    </div>
  ),
}));

describe("truncateWithTooltip", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns '-' when input string is empty", () => {
    const result = truncateWithTooltip("");

    render(result);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  test("returns full string when screen width >= 1024", () => {
    // Mock window width
    global.innerWidth = 1400;

    const result = truncateWithTooltip("HelloWorld");

    render(result);

    expect(screen.getByText("HelloWorld")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltip")).toBeNull();
  });

  test("returns truncated string with tooltip when screen < 1024", () => {
    global.innerWidth = 500;

    const result = truncateWithTooltip("ABCDEFGHIJKLMNOP"); // length > max

    render(result);

    // Tooltip should be there
    const tooltip = screen.getByTestId("tooltip");
    expect(tooltip).toBeInTheDocument();

    // Tooltip title should be original string
    expect(tooltip).toHaveAttribute("data-title", "ABCDEFGHIJKLMNOP");

    // Truncated text visible
    expect(screen.getByText("TRUNCATED_VALUE")).toBeInTheDocument();
  });

  test("does NOT truncate if string length <= max", () => {
    global.innerWidth = 500;

    const result = truncateWithTooltip("Short");

    render(result);

    expect(screen.getByText("Short")).toBeInTheDocument();
    expect(screen.queryByTestId("tooltip")).toBeNull();
  });
});
