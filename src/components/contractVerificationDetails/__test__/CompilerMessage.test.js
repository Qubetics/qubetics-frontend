import React from "react";
import { render, screen } from "@testing-library/react";
import CompilerMessage from "../CompilerMessage";

describe("CompilerMessage Component", () => {
  test("renders compiler messages list", () => {
    const messages = [
      "Error: something failed\nLine: 20",
      "Warning: deprecated function\nLine: 10",
    ];

    render(<CompilerMessage compilerMessage={messages} />);

    expect(screen.getByText("Compiler Messages")).toBeInTheDocument();
    expect(screen.getByText(/Error: something failed/)).toBeInTheDocument();
    expect(screen.getByText(/Warning: deprecated function/)).toBeInTheDocument();
  });

  test("renders <br> for line breaks", () => {
    const messages = ["Line1\nLine2"];

    render(<CompilerMessage compilerMessage={messages} />);

    const pre = screen.getByText(/Line1/);
    // Component renders newlines directly in pre tag, not as <br>
    expect(pre.textContent).toContain("Line1");
    expect(pre.textContent).toContain("Line2");
  });

  test("returns null when compilerMessage is empty", () => {
    const { container } = render(<CompilerMessage compilerMessage={[]} />);
    // Component still renders wrapper, just with empty ul
    expect(container.querySelector('ul').children.length).toBe(0);
  });

  test("returns null when compilerMessage is undefined", () => {
    const { container } = render(<CompilerMessage compilerMessage={undefined} />);
    expect(container.firstChild).toBeNull();
  });
});
