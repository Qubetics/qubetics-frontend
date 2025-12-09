import React from "react";
import { render, screen } from "@testing-library/react";
import ContractAbi from "../ContractAbi";

jest.mock("../../DoCopy/CopyText", () => jest.fn(() => <div data-testid="copy-btn" />));

describe("ContractAbi Component", () => {
    test("renders ABI when verificationType is valid", () => {
        const mockData = {
            verificationType: 1,
            abi: JSON.stringify([{ name: "testFunction", type: "function" }])
        };

        render(<ContractAbi contractDetailData={mockData} />);

        expect(screen.getByText("Contract ABI")).toBeInTheDocument();
        expect(screen.getByTestId("copy-btn")).toBeInTheDocument();
        expect(screen.getByText(/testFunction/)).toBeInTheDocument();
    });

    test("does not render component when verificationType = -1", () => {
        const mockData = { verificationType: -1, abi: "{}" };
        const { container } = render(<ContractAbi contractDetailData={mockData} />);
        expect(container.firstChild).toBeNull();
    });

    test("renders fallback {} when ABI is invalid", () => {
        const mockData = {
            verificationType: 1,
            abi: "{invalid-json"
        };

        render(<ContractAbi contractDetailData={mockData} />);

        expect(screen.getByText("Contract ABI")).toBeInTheDocument();
        // Component stringifies the fallback, so it shows "{}" with quotes
        expect(screen.getByText(/"{}"/)).toBeInTheDocument();
    });

    test("renders <br> for newline replacements", () => {
        const mockData = {
            verificationType: 1,
            abi: JSON.stringify({ test: "line1\nline2" })
        };

        render(<ContractAbi contractDetailData={mockData} />);

        const pre = screen.getByText(/line1/);
        // Check that both lines are present in the content
        expect(pre.textContent).toContain("line1");
        expect(pre.textContent).toContain("line2");
    });
});
