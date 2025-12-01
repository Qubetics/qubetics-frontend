import React from "react";
import { render, screen } from "@testing-library/react";
import GetStart from "../FooterLinks";

jest.mock("../Footer", () => () => <div>Mocked Footer</div>);

describe("GetStart Component", () => {
  test("renders GetStart container", () => {
    render(<GetStart />);
    expect(screen.getByText("Mocked Footer")).toBeInTheDocument();
  });

  test("has followSection wrapper", () => {
    const { container } = render(<GetStart />);
    expect(container.querySelector(".followSection")).toBeTruthy();
  });

  test("has contact id element", () => {
    const { container } = render(<GetStart />);
    expect(container.querySelector("#contact")).toBeTruthy();
  });
});
