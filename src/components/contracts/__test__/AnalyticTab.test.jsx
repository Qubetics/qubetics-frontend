import React from "react";
import { render, screen } from "@testing-library/react";
import AnalyticTab from "../AnalyticTab";

// Mock AntD Tabs (important for tests)
jest.mock("antd", () => ({
  Tabs: ({ items }) => (
    <div>
      {items.map((item) => (
        <div key={item.key}>
          <div>{item.label}</div>
          <div>{item.children}</div>
        </div>
      ))}
    </div>
  ),
}));

// Mock child component
jest.mock("../../analyticdetailtab/AnalyticToken", () => ({
  __esModule: true,
  default: ({ address }) => <div>Mock AnalyticToken: {address}</div>,
}));

describe("AnalyticTab Component", () => {
  test("renders without crashing", () => {
    render(<AnalyticTab hash="0x123" />);
    expect(screen.getByText("Token Contract Overview")).toBeInTheDocument();
  });

  test("renders AnalyticToken with correct hash", () => {
    render(<AnalyticTab hash="0xABCDEF" />);

    expect(
      screen.getByText("Mock AnalyticToken: 0xABCDEF")
    ).toBeInTheDocument();
  });
});
