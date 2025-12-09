import { render, screen, waitFor } from "@testing-library/react";
import BlockDetailDescription from "./../BlockDetaildescription";
import getStatistics from "@/services/getStatistics";
import { useLatestData } from "../../contexts/latest_data";
import { useRouter } from "next/navigation";

// Mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../contexts/latest_data", () => ({
  useLatestData: jest.fn(),
}));

jest.mock("@/services/getStatistics");

describe("BlockDetailDescription - simplified test", () => {
  const mockRouterPush = jest.fn();
  const mockBlockData = {
    blocknumber: 10,
    blockhash: "0xhash",
    miner: "0xminer",
    transactionCount: 5,
    block: {
      size: 1000,
      gasUsed: 5000,
      nonce: 1,
    },
  };

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockRouterPush });
    useLatestData.mockReturnValue({ blocks: { blocknumber: 15 } });
    getStatistics.mockResolvedValue({ data: { latest_block: 20 } });

    // Mock localStorage for chain type
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "EVM Chain"),
      },
      writable: true,
    });

    jest.clearAllMocks();
  });

  test("renders basic block info and EVM chain fields", async () => {
    render(<BlockDetailDescription blockData={mockBlockData} />);

    await waitFor(() => {
      expect(getStatistics).toHaveBeenCalled();
    });

    // Basic fields
    expect(screen.getByText("0xhash")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("0xminer")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    // EVM Chain-specific fields
    expect(screen.getByText("1000")).toBeInTheDocument(); // Weight/Size
    expect(screen.getByText("5000")).toBeInTheDocument(); // Gas Used
    expect(screen.getByText("1")).toBeInTheDocument(); // Nonce
  });

  test("shows fallback '-' for missing fields", async () => {
    render(<BlockDetailDescription blockData={{}} />);

    await waitFor(() => {
      expect(getStatistics).toHaveBeenCalled();
    });

    expect(screen.getAllByText("-").length).toBeGreaterThan(0);
  });

  test("navigates to previous and next block when arrows clicked", async () => {
    render(<BlockDetailDescription blockData={mockBlockData} />);

    await waitFor(() => expect(getStatistics).toHaveBeenCalled());

    // Get arrows and simulate clicks
    const arrows = screen.getAllByRole("img");
    arrows[0].click(); // Left arrow
    arrows[1].click(); // Right arrow

    expect(mockRouterPush).toHaveBeenCalledWith("/blocks/9");
    expect(mockRouterPush).toHaveBeenCalledWith("/blocks/11");
  });
});
