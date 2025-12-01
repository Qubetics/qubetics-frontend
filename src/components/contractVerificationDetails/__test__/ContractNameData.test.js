import React from "react";
import { render, screen } from "@testing-library/react";
import ContractNameData from "../ContractNameData";
import { contractData } from "../../contractDetailTabs/ContractData";

jest.mock("../../contractDetailTabs/ContractData", () => ({
  contractData: jest.fn()
}));

jest.mock("@/constant/constant", () => ({
  firstCapitalLetter: jest.fn(str => `Cap-${str}`)
}));

describe("ContractNameData Component", () => {
  test("renders contract details when data exists", () => {
    const mockDetail = [
      { contract: "TestContract", Homer: "owner", name: "John", data: "123" }
    ];
    contractData.mockReturnValue(mockDetail);

    render(<ContractNameData contractDetailData={{}} />);

    expect(screen.getByText("TestContract")).toBeInTheDocument();
    expect(screen.getByText("Cap-owner")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
  });

  test("renders '-' when fields are missing", () => {
    const mockDetail = [{ contract: "", Homer: "", name: "", data: "" }];
    contractData.mockReturnValue(mockDetail);

    render(<ContractNameData contractDetailData={{}} />);

    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  test("renders fallback message when no data", () => {
    contractData.mockReturnValue([]);

    render(<ContractNameData contractDetailData={{}} />);

    expect(screen.getByText("No contract details available.")).toBeInTheDocument();
  });
});
