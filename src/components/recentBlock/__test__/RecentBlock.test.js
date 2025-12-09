import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RecentBlock from "../RecentBlock";
import { useRouter } from "next/navigation";
import getAddress from "@/utils/getAddress";
import { renderTime } from "@/utils/renderTime";
import { Routes } from "@/constant/constant";
import { trackEvent } from "@/utils/eventTrack";

// Mock dependencies
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("@/utils/getAddress", () => jest.fn());
jest.mock("@/utils/renderTime", () => ({
    renderTime: jest.fn(),
}));
jest.mock("@/constant/constant", () => ({
    Routes: {
        BLOCK_NO: "/block/",
    },
}));
jest.mock("@/utils/eventTrack", () => ({
    trackEvent: jest.fn(),
}));
jest.mock("next/link", () => ({ children }) => <span>{children}</span>);

// Mock SCSS
jest.mock("./RecentBlock.scss", () => ({}));
jest.mock("../transferInfo/TransferInformation.scss", () => ({}));

describe("RecentBlock Component", () => {
    const mockRouter = { push: jest.fn() };
    const mockData = {
        blocknumber: "12345",
        timestamp: "1678900000",
        transactionCount: 50,
        miner: "0xmineraddress",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useRouter.mockReturnValue(mockRouter);
        getAddress.mockImplementation((addr) => `formatted-${addr}`);
        renderTime.mockReturnValue("5 mins ago");
    });

    test("renders correctly with full data", () => {
        render(<RecentBlock data={mockData} />);

        // Check block number
        expect(screen.getByText("12345")).toBeInTheDocument();

        // Check timestamp (appears twice in the component)
        const timestamps = screen.getAllByText("5 mins ago");
        expect(timestamps.length).toBeGreaterThanOrEqual(1);

        // Check transaction count
        expect(screen.getByText("50 txn")).toBeInTheDocument();

        // Check miner address
        expect(screen.getByText("Validator:")).toBeInTheDocument();
        expect(screen.getByText("formatted-0xmineraddress")).toBeInTheDocument();
    });

    test("renders with custom class", () => {
        const { container } = render(<RecentBlock data={mockData} customClass="my-custom-class" />);
        expect(container.firstChild).toHaveClass("recentblocks my-custom-class");
    });

    test("navigates and tracks event on block number click", () => {
        render(<RecentBlock data={mockData} />);

        const blockNumber = screen.getByText("12345");
        fireEvent.click(blockNumber);

        expect(trackEvent).toHaveBeenCalledWith({
            category: "Block",
            action: "Block Number",
            label: mockData.blocknumber,
        });
        expect(mockRouter.push).toHaveBeenCalledWith(`${Routes.BLOCK_NO}${mockData.blocknumber}`);
    });

    test("handles missing block number", () => {
        const data = { ...mockData, blocknumber: null };
        render(<RecentBlock data={data} />);
        expect(screen.getByText("-")).toBeInTheDocument();
    });

    test("handles missing timestamp", () => {
        const data = { ...mockData, timestamp: null };
        render(<RecentBlock data={data} />);
        // Should render "-" for timestamp
        const dashes = screen.getAllByText("-");
        expect(dashes.length).toBeGreaterThan(0);
    });

    test("handles missing transaction count", () => {
        const data = { ...mockData, transactionCount: null };
        render(<RecentBlock data={data} />);
        expect(screen.getByText("0 txn")).toBeInTheDocument();
    });

    test("handles missing miner address", () => {
        const data = { ...mockData, miner: null };
        render(<RecentBlock data={data} />);
        // Should render "-" for missing miner
        const dashes = screen.getAllByText("-");
        expect(dashes.length).toBeGreaterThan(0);
    });


});
