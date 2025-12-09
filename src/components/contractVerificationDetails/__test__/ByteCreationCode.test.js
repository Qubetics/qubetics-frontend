import React from "react";
import { render, screen } from "@testing-library/react";
import ByteCreationCode from "../ByteCreationCode";

jest.mock("../../contractDetailTabs/ContractData", () => ({
  contractByteCode: jest.fn(),
}));

jest.mock("../../DoCopy/CopyText", () => () => <div data-testid="copy-btn">Copy</div>);

import { contractByteCode } from "../../contractDetailTabs/ContractData";

describe("ByteCreationCode Component", () => {
  test("renders byte code snippets when available", () => {
    const mockSnippets = [
      { title: "Snippet 1", content: "0x123abc" },
      { title: "Snippet 2", content: "0x456def" },
    ];

    contractByteCode.mockReturnValue(mockSnippets);

    render(<ByteCreationCode contractDetailData={{}} />);

    expect(screen.getByText("Snippet 1")).toBeInTheDocument();
    expect(screen.getByText("Snippet 2")).toBeInTheDocument();
    expect(screen.getByText("0x123abc")).toBeInTheDocument();
    expect(screen.getByText("0x456def")).toBeInTheDocument();
    expect(screen.getAllByTestId("copy-btn").length).toBe(2);
  });

  test("shows fallback text when no snippets available", () => {
    contractByteCode.mockReturnValue([]);

    render(<ByteCreationCode contractDetailData={{}} />);

    expect(
      screen.getByText("No byte code snippets available.")
    ).toBeInTheDocument();
  });

  test("handles undefined snippet list", () => {
    contractByteCode.mockReturnValue(undefined);

    render(<ByteCreationCode contractDetailData={{}} />);

    expect(
      screen.getByText("No byte code snippets available.")
    ).toBeInTheDocument();
  });
});
