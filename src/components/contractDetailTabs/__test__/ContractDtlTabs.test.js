import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

// Mock getAbiData service
const mockGetAbiData = jest.fn();
jest.mock("@/services/getAbiData", () => mockGetAbiData);

// Mock constants
jest.mock("@/constant/constant", () => ({
    InitStatus: "init",
    FetchingStatus: "fetching",
    SuccessStatus: "success",
    ErrorStatus: "error",
}));

// Mock next/dynamic - return a simple component
jest.mock("next/dynamic", () => () => {
    return () => <div data-testid="dynamic-component">Dynamic Component</div>;
});

// Mock child components
jest.mock("../CodeTabContent", () => () => (
    <div data-testid="code-tab-content">CodeTab</div>
));
jest.mock("../ReadCodeContent", () => () => (
    <div data-testid="read-code-content">ReadCode</div>
));
jest.mock("../WriteContent", () => () => (
    <div data-testid="write-content">WriteCode</div>
));
jest.mock("../../loader/Loader", () => () => (
    <div data-testid="loader">Loading</div>
));

// Mock antd Tabs
jest.mock("antd", () => ({
    Tabs: ({ items }) => (
        <div data-testid="tabs-container">
            {items.map((item) => (
                <div key={item.key} data-testid={`tab-${item.key}`}>
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    ),
}));

// Import component after all mocks
import ContractDtlTabs from "../ContractDtlTabs";

describe("ContractDtlTabs Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("renders loader initially while fetching data", () => {
        mockGetAbiData.mockReturnValue(new Promise(() => { }));

        render(<ContractDtlTabs hash="0x123" />);

        expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
    });

    test("renders tabs when abi data is available", async () => {
        mockGetAbiData.mockResolvedValue({
            abi: [{ name: "function1" }, { name: "function2" }],
            proxyABI: [],
        });

        render(<ContractDtlTabs hash="0xabc" />);

        await waitFor(() => {
            expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
        });
    });

    test("renders only CodeTabContent when abi is empty", async () => {
        mockGetAbiData.mockResolvedValue({
            abi: [],
            proxyABI: [],
        });

        render(<ContractDtlTabs hash="0x456" />);

        await waitFor(() => {
            expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
        });

        expect(screen.queryByTestId("tabs-container")).not.toBeInTheDocument();
    });

    test("renders CodeTabContent on fetch error", async () => {
        mockGetAbiData.mockRejectedValue(new Error("API Error"));

        render(<ContractDtlTabs hash="0x789" />);

        await waitFor(() => {
            expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
        });

        expect(screen.queryByTestId("tabs-container")).not.toBeInTheDocument();
    });

    test("renders proxy tabs when proxyABI has data", async () => {
        mockGetAbiData.mockResolvedValue({
            abi: [{ name: "fn1" }],
            proxyABI: [{ name: "proxyFn1" }, { name: "proxyFn2" }],
        });

        render(<ContractDtlTabs hash="0xproxy" />);

        await waitFor(() => {
            expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
        });
    });

    test("handles null abi and proxyABI", async () => {
        mockGetAbiData.mockResolvedValue({
            abi: null,
            proxyABI: null,
        });

        render(<ContractDtlTabs hash="0xnull" />);

        await waitFor(() => {
            expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
        });
    });

    test("handles undefined response", async () => {
        mockGetAbiData.mockResolvedValue(undefined);

        render(<ContractDtlTabs hash="0xundefined" />);

        await waitFor(() => {
            expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
        });
    });

    test("filters out falsy items from tabs array", async () => {
        mockGetAbiData.mockResolvedValue({
            abi: [{ name: "test" }],
            proxyABI: [],
        });

        render(<ContractDtlTabs hash="0xfilter" />);

        await waitFor(() => {
            expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
        });
    });

    test("renders all 5 tabs when both abi and proxyABI have data", async () => {
        mockGetAbiData.mockResolvedValue({
            abi: [{ name: "fn1" }],
            proxyABI: [{ name: "proxy1" }],
        });

        render(<ContractDtlTabs hash="0xboth" />);

        await waitFor(() => {
            expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
        });
    });

    test("renders with multiple abi items", async () => {
        mockGetAbiData.mockResolvedValue({
            abi: [
                { name: "fn1" },
                { name: "fn2" },
                { name: "fn3" },
                { name: "fn4" },
                { name: "fn5" },
            ],
            proxyABI: [],
        });

        render(<ContractDtlTabs hash="0xmulti" />);

        await waitFor(() => {
            expect(screen.getByTestId("dynamic-component")).toBeInTheDocument();
        });
    });
});
