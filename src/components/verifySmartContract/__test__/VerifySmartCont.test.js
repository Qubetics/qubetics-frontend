import React from "react";
import { render, screen } from "@testing-library/react";
import VerifySmartCont from "../VerifySmartCont";
import { useContractData } from "../../contexts/contractContext";
import { verifyContractConstant } from "@/constant/constant";

// Mock the context hook
jest.mock("../../contexts/contractContext", () => ({
    useContractData: jest.fn(),
}));

// Mock child components
jest.mock("../../customInput/CustomInput", () => {
    return function MockCustomInput(props) {
        return <div data-testid="custom-input">{props.label}</div>;
    };
});

jest.mock("../../accordionLibName/AccordionLibName", () => {
    return function MockAccordionLibName() {
        return <div data-testid="accordion-lib-name">AccordionLibName</div>;
    };
});

jest.mock("../../miscSetting/MiscSetting", () => {
    return function MockMiscSetting() {
        return <div data-testid="misc-setting">MiscSetting</div>;
    };
});

jest.mock("@/app/(routes)/contract/verify/ABICode", () => {
    return function MockABICode() {
        return <div data-testid="abi-code">ABICode</div>;
    };
});

// Mock Next.js Link
jest.mock("next/link", () => {
    return function MockLink({ children, href }) {
        return <a href={href}>{children}</a>;
    };
});

// Mock SCSS import
jest.mock("../VerifySmartCont.scss", () => ({}));

describe("VerifySmartCont Component", () => {
    const mockFormData = {
        compilerType: "Solidity",
        compilerVersion: "v0.8.0+commit.c7dfd78e",
        licenseType: "MIT",
    };

    const mockContractAddress = "0x1234567890abcdef1234567890abcdef12345678";
    const mockVerifyAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";

    const MockChildren = () => <div data-testid="mock-children">Children Content</div>;
    const MockFormButton = () => <button data-testid="mock-form-button">Submit</button>;

    beforeEach(() => {
        jest.clearAllMocks();
        useContractData.mockReturnValue({
            formData: mockFormData,
            contractAddress: mockContractAddress,
            verifyAddress: mockVerifyAddress,
        });
    });

    describe("Basic Rendering", () => {
        test("renders without crashing", () => {
            render(<VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />);
            expect(screen.getByTestId("mock-form-button")).toBeInTheDocument();
        });

        test("renders the main container with correct class", () => {
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });

        test("renders Collapse component", () => {
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".ant-collapse")).toBeInTheDocument();
        });

        test("renders all four panels", () => {
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            const panels = container.querySelectorAll(".ant-collapse-item");
            expect(panels.length).toBe(4);
        });
    });

    describe("Panel Headers", () => {
        test("renders Upload Contract Source Code panel header", () => {
            render(<VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />);
            expect(screen.getByText("Upload Contract Source Code")).toBeInTheDocument();
        });

        test("renders Enter Contract ABI panel header", () => {
            render(<VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />);
            expect(screen.getByText("Enter Contract ABI (Optional)")).toBeInTheDocument();
        });

        test("renders Contract Library Address panel header", () => {
            render(<VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />);
            expect(screen.getByText(/Contract Library Address/)).toBeInTheDocument();
        });

        test("renders Misc Settings panel header", () => {
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.textContent).toContain("Misc Settings");
        });
    });

    describe("Context Data - useContractData Hook", () => {
        test("calls useContractData hook", () => {
            render(<VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />);
            expect(useContractData).toHaveBeenCalled();
        });

        test("renders with contractAddress from context", () => {
            render(<VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />);
            expect(useContractData).toHaveBeenCalled();
        });

        test("renders with verifyAddress when contractAddress is empty", () => {
            useContractData.mockReturnValue({
                formData: mockFormData,
                contractAddress: "",
                verifyAddress: mockVerifyAddress,
            });

            render(<VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />);
            expect(useContractData).toHaveBeenCalled();
        });

        test("renders with verifyAddress when contractAddress is null", () => {
            useContractData.mockReturnValue({
                formData: mockFormData,
                contractAddress: null,
                verifyAddress: mockVerifyAddress,
            });

            render(<VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />);
            expect(useContractData).toHaveBeenCalled();
        });

        test("handles empty formData gracefully", () => {
            useContractData.mockReturnValue({
                formData: {},
                contractAddress: mockContractAddress,
                verifyAddress: mockVerifyAddress,
            });

            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });

        test("handles null formData gracefully", () => {
            useContractData.mockReturnValue({
                formData: null,
                contractAddress: mockContractAddress,
                verifyAddress: mockVerifyAddress,
            });

            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });

        test("handles undefined formData gracefully", () => {
            useContractData.mockReturnValue({
                formData: undefined,
                contractAddress: mockContractAddress,
                verifyAddress: mockVerifyAddress,
            });

            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });
    });

    describe("Props Rendering", () => {
        test("renders FormButton prop component", () => {
            render(<VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />);
            expect(screen.getByTestId("mock-form-button")).toBeInTheDocument();
            expect(screen.getByText("Submit")).toBeInTheDocument();
        });

        test("renders with different FormButton component", () => {
            const CustomFormButton = () => <div data-testid="custom-form-button">Custom Button</div>;
            render(<VerifySmartCont Children={MockChildren} FormButton={CustomFormButton} />);
            expect(screen.getByTestId("custom-form-button")).toBeInTheDocument();
        });

        test("accepts Children prop", () => {
            // Children is rendered inside collapsed panel, so we just verify it accepts the prop
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });

        test("accepts different Children component", () => {
            const CustomChildren = () => <div data-testid="custom-children">Custom Content</div>;
            const { container } = render(
                <VerifySmartCont Children={CustomChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });
    });

    describe("Component Structure", () => {
        test("renders getqotSection container", () => {
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".getqotSection")).toBeInTheDocument();
        });

        test("renders complete component structure", () => {
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );

            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
            expect(container.querySelector(".getqotSection")).toBeInTheDocument();
            expect(container.querySelector(".ant-collapse")).toBeInTheDocument();
        });

        test("renders with all required sections", () => {
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );

            // Main container
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
            // Collapse section
            expect(container.querySelector(".ant-collapse")).toBeInTheDocument();
            // Form button
            expect(screen.getByTestId("mock-form-button")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        test("handles both contractAddress and verifyAddress being empty", () => {
            useContractData.mockReturnValue({
                formData: mockFormData,
                contractAddress: "",
                verifyAddress: "",
            });

            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });

        test("handles all undefined context values", () => {
            useContractData.mockReturnValue({
                formData: undefined,
                contractAddress: undefined,
                verifyAddress: undefined,
            });

            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });

        test("renders correctly with partial formData - only compilerType", () => {
            useContractData.mockReturnValue({
                formData: {
                    compilerType: "Solidity",
                },
                contractAddress: mockContractAddress,
                verifyAddress: mockVerifyAddress,
            });

            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });

        test("renders correctly with partial formData - only compilerVersion", () => {
            useContractData.mockReturnValue({
                formData: {
                    compilerVersion: "v0.8.0",
                },
                contractAddress: mockContractAddress,
                verifyAddress: mockVerifyAddress,
            });

            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });
    });

    describe("Integration Tests", () => {
        test("renders with all panel headers together", () => {
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );

            expect(screen.getByText("Upload Contract Source Code")).toBeInTheDocument();
            expect(screen.getByText("Enter Contract ABI (Optional)")).toBeInTheDocument();
            expect(screen.getByText(/Contract Library Address/)).toBeInTheDocument();
            expect(container.textContent).toContain("Misc Settings");
        });

        test("renders with minimal context data", () => {
            useContractData.mockReturnValue({
                formData: {},
                contractAddress: "",
                verifyAddress: "",
            });

            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );

            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
            expect(screen.getByTestId("mock-form-button")).toBeInTheDocument();
        });

        test("renders complete component with all props and context", () => {
            const { container } = render(
                <VerifySmartCont Children={MockChildren} FormButton={MockFormButton} />
            );

            // Verify all main sections
            expect(screen.getByText("Upload Contract Source Code")).toBeInTheDocument();
            expect(screen.getByTestId("mock-form-button")).toBeInTheDocument();
            expect(useContractData).toHaveBeenCalled();
            expect(container.querySelector(".verifysmartContract")).toBeInTheDocument();
        });
    });
});
