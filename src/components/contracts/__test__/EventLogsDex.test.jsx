import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventLogsDex } from "../EventLogsDex";

// Mock dependencies
jest.mock("@/utils/commonFunctions", () => ({
  capitalizeWord: (str) => `Cap-${str}`,
  noExponentsValue: (val) => `NE-${val}`,
}));

jest.mock("../../customSelect/CustomSelect", () => {
  return ({ value, onChange }) => (
    <select
      data-testid="custom-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="hex">HEX</option>
      <option value="dec">DEC</option>
    </select>
  );
});

describe("EventLogsDex Component", () => {
  test("renders '-' when no method/topics OR invalid condition", () => {
    render(<EventLogsDex text={{}} decodedLogs={undefined} />);
    expect(screen.getByText("-")).toBeInTheDocument();
  });

  test("renders method name when decodedLogs is undefined", () => {
    const mockText = {
      method: "transfer",
      topics: ["0xabc"],
    };

    render(<EventLogsDex text={mockText} decodedLogs={undefined} />);

    expect(screen.getByText("Cap-transfer")).toBeInTheDocument();
  });

  test("does NOT render method when decodedLogs is provided", () => {
    const mockText = {
      method: "approve",
      topics: ["0x111", "0x222"],
    };

    render(<EventLogsDex text={mockText} decodedLogs={{ some: "data" }} />);

    // Should NOT render capitalizeWord text
    expect(screen.queryByText("Cap-approve")).not.toBeInTheDocument();
  });

  test("renders topics in HEX format by default", () => {
    const mockText = {
      method: "transfer",
      topics: ["0xabc", "0xdef"],
    };

    render(<EventLogsDex text={mockText} decodedLogs={undefined} />);

    expect(
      screen.getByText((content) => content.includes("[topic0]"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("0xabc"))
    ).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes("0xdef"))
    ).toBeInTheDocument();
  });

  test("switches to DEC (noExponentValue) when select changes", () => {
    const mockText = {
      method: "transfer",
      topics: ["10"],
    };

    render(<EventLogsDex text={mockText} decodedLogs={undefined} />);

    // Select DEC
    fireEvent.change(screen.getByTestId("custom-select"), {
      target: { value: "dec" },
    });

    expect(
      screen.getByText((content) => content.includes("NE-10"))
    ).toBeInTheDocument();
  });

  test("renders when decodedLogs exists + topics present", () => {
    const mockText = {
      method: "approve",
      topics: ["0x123"],
    };

    render(<EventLogsDex text={mockText} decodedLogs={{ dummy: true }} />);

    // no method name should appear
    expect(screen.queryByText("Cap-approve")).not.toBeInTheDocument();

    // topics should appear
    expect(
      screen.getByText((content) => content.includes("[topic0]"))
    ).toBeInTheDocument();
  });
});
