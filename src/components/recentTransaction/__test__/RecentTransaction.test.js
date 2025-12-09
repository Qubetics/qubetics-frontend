import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecentTransaction from "../RecentTransaction";
import { useRouter } from "next/navigation";
import getAddress from "@/utils/getAddress";
import { renderTime } from "@/utils/renderTime";
import { noExponentsValue } from "@/utils/commonFunctions";
import { currencyName, Routes, toFixedWithoutRounding } from "@/constant/constant";

// Mock dependencies
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/utils/getAddress", () => jest.fn());
jest.mock("@/utils/renderTime", () => ({
    renderTime: jest.fn(),
}));
jest.mock("@/utils/commonFunctions", () => ({
    noExponentsValue: jest.fn(),
}));

jest.mock("@/constant/constant", () => ({
    currencyName: "Qubic",
    Routes: {
        TRANSACTIONS: "/tx",
    },
    toFixedWithoutRounding: jest.fn(),
}));

jest.mock("../../../../public/SvgIcons", () => ({
    NextArrow: () => <span data-testid="next-arrow" />,
}));

// Mock SCSS
jest.mock("../recentBlock/RecentBlock.scss", () => ({}));

describe("RecentTransaction Component", () => {
    const mockRouter = { push: jest.fn() };
    const mockData = {
        txhash: "0x123abc",
        fromAddress: "0xsender",
        toAddress: "0xreceiver",
        value: "100",
        timestamp: "1234567890",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockReturnValue(mockRouter);
        getAddress.mockImplementation((addr) => `formatted-${addr}`);
        renderTime.mockReturnValue("1 min ago");
        noExponentsValue.mockReturnValue("100");
        toFixedWithoutRounding.mockReturnValue("100.000000");
    });

    test("renders correctly with full data", () => {
        render(<RecentTransaction data={mockData} />);

        // Check txhash
        expect(screen.getByText("formatted-0x123abc")).toBeInTheDocument();

        // Check fromAddress
        expect(screen.getByText("formatted-0xsender")).toBeInTheDocument();

        // Check toAddress
        expect(screen.getByText("formatted-0xreceiver")).toBeInTheDocument();

        // Check value
        expect(screen.getByText("100.000000 Qubic")).toBeInTheDocument();

        // Check timestamp
        expect(screen.getByText("1 min ago")).toBeInTheDocument();

        // Check NextArrow
        expect(screen.getByTestId("next-arrow")).toBeInTheDocument();
    });

    test("renders with custom class", () => {
        const { container } = render(<RecentTransaction data={mockData} customClass="my-custom-class" />);
        expect(container.firstChild).toHaveClass("recentblocks recentTransaction my-custom-class");
    });

    test("navigates to transaction details on click", () => {
        render(<RecentTransaction data={mockData} />);

        const txLink = screen.getByText("formatted-0x123abc");
        fireEvent.click(txLink);

        expect(mockRouter.push).toHaveBeenCalledWith(`${Routes.TRANSACTIONS}/${mockData.txhash}`);
    });

    test("handles missing txhash", () => {
        const data = { ...mockData, txhash: null };
        render(<RecentTransaction data={data} />);
        expect(screen.getByText("-")).toBeInTheDocument();
    });

    test("handles missing fromAddress", () => {
        const data = { ...mockData, fromAddress: null };
        render(<RecentTransaction data={data} />);
        // The component renders "-" for missing fromAddress
        const dashes = screen.getAllByText("-");
        expect(dashes.length).toBeGreaterThan(0);
    });

    test("handles missing timestamp", () => {
        const data = { ...mockData, timestamp: null };
        render(<RecentTransaction data={data} />);
        // Should render "-" for timestamp
        const dashes = screen.getAllByText("-");
        expect(dashes.length).toBeGreaterThan(0);
    });

    test("handles missing value", () => {
        const data = { ...mockData, value: null };
        render(<RecentTransaction data={data} />);
        expect(screen.getByText("0 Qubic")).toBeInTheDocument();
    });

    test("displays contract address when toAddress is N/A", () => {
        const data = {
            ...mockData,
            toAddress: "N/A",
            contractAddress: "0xcontract"
        };
        render(<RecentTransaction data={data} />);

        expect(screen.getByText("formatted-0xcontract")).toBeInTheDocument();
    });

    test("displays '-' when toAddress is N/A and contractAddress is missing", () => {
        const data = {
            ...mockData,
            toAddress: "N/A",
            contractAddress: null
        };
        render(<RecentTransaction data={data} />);

        // Should verify specifically the trnxCount span has "-"
        // Since there might be multiple "-" on screen, we can look into the specific container
        const trnxCount = screen.getByText((content, element) => {
            return element.className === 'trnxCount' && content === '-';
        });
        expect(trnxCount).toBeInTheDocument();
    });


});
