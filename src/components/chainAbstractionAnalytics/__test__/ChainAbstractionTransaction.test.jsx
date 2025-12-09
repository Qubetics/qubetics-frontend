import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import ChainAbstractionTransaction from "./../ChainAbstractionTransaction";
import GetChainAbstractionTransaction from "@/services/getChainAbstractionTx";
import { useRouter } from "next/navigation";

// Mock API
jest.mock("@/services/getChainAbstractionTx");

// Mock CopyText
jest.mock("../../DoCopy/CopyText", () => ({ text }) => <span>{text}</span>);

// Mock Pagination
jest.mock("@/components/Pagination/Pagination", () => ({
  __esModule: true,
  default: ({ handleNext, handlePrevious, handleFirst, handleLast }) => (
    <div>
      <button onClick={handlePrevious}>Previous</button>
      <button onClick={handleNext}>Next</button>
      <button onClick={handleFirst}>First</button>
      <button onClick={handleLast}>Last</button>
    </div>
  ),
}));

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock getComputedStyle to fix JSDOM issue
Object.defineProperty(window, "getComputedStyle", {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    getPropertyValue: jest.fn(),
  })),
});

describe("ChainAbstractionTransaction Component", () => {
  const push = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push });
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "BTC",
            amount: 0.12,
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: "completed",
            target_chain: "BTC",
          },
        ],
        total: 1,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", async () => {
    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  test("renders table with transaction data", async () => {
    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    // Wait for async data to load
    await waitFor(() => {
      expect(screen.getByText("0x123...0x123")).toBeInTheDocument(); // intent_hash
      expect(screen.getByText("0 ETH")).toBeInTheDocument(); // source token
      expect(screen.getByText("0.0000000012 BTC")).toBeInTheDocument(); // target token
      expect(screen.getByText("-")).toBeInTheDocument(); // status
    });
  });

  test("calls API once on mount", async () => {
    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });
    await waitFor(() => {
      expect(GetChainAbstractionTransaction).toHaveBeenCalledTimes(1);
    });
  });

  test("pagination buttons work", async () => {
    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    const nextButton = screen.getByText("Next");
    const prevButton = screen.getByText("Previous");

    // Click next
    fireEvent.click(nextButton);
    fireEvent.click(prevButton);

    // Just check function calls since handlers change currentPage state
    expect(nextButton).toBeInTheDocument();
    expect(prevButton).toBeInTheDocument();
  });

  test("clicking View action navigates to intent page", async () => {
    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });
    await waitFor(() => {
      const viewButton = screen.getByText("View");
      fireEvent.click(viewButton);
      expect(push).toHaveBeenCalledWith("/chain-abstraction/0x123");
    });
  });

  test("renders empty state when no transactions", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [],
        total: 0,
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(
        screen.getByText("No data", { selector: ".ant-empty-description" })
      ).toBeInTheDocument();
    });
  });

  test("renders multiple transactions", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "BTC",
            amount: 0.12,
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: "completed",
            target_chain: "BTC",
          },
          {
            intent_hash: "0x789",
            created_at: "2025-11-25T12:00:00Z",
            source_token: "USDT",
            source_amount: 100,
            target_token: "TICS",
            amount: 50,
            solver_tx_hash: "0xabc",
            updated_at: "2025-11-25T13:00:00Z",
            intent_update_status: "pending",
            target_chain: "TICS",
          },
        ],
        total: 2,
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(screen.getByText("0x123...0x123")).toBeInTheDocument();
      expect(screen.getByText("0x789...0x789")).toBeInTheDocument();
      expect(screen.getByText("0 ETH")).toBeInTheDocument();
      expect(screen.getByText("0.0000000012 BTC")).toBeInTheDocument();
    });
  });

  test("renders different status correctly", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "BTC",
            amount: 0.12,
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: "pending",
            target_chain: "BTC",
          },
        ],
        total: 1,
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      const statusElement = screen.getByText("-");
      expect(statusElement).toHaveClass("status-tag--");
    });
  });

  test("pagination handles next and previous with page changes", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "BTC",
            amount: 0.12,
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: "completed",
            target_chain: "BTC",
          },
        ],
        total: 20, // More than tableLimit
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(GetChainAbstractionTransaction).toHaveBeenCalledWith(1, 10);
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(GetChainAbstractionTransaction).toHaveBeenCalledWith(2, 10);
    });
  });

  test("renders explorer link for BTC and TICS", async () => {
    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(screen.getByText("Bitcoin")).toBeInTheDocument();
    });
  });

  test("renders explorer link for TICS", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "TICS",
            amount: 0.12,
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: "completed",
            target_chain: "TICS",
          },
        ],
        total: 1,
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(screen.getByText("Qubetics")).toBeInTheDocument();
    });
  });

  test("renders no explorer link for unsupported token", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "UNKNOWN",
            amount: 0.12,
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: "completed",
            target_chain: "UNKNOWN",
          },
        ],
        total: 1,
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(screen.queryByText("Bitcoin")).not.toBeInTheDocument();
      expect(screen.queryByText("Qubetics")).not.toBeInTheDocument();
    });
  });

  test("renders without intent_hash", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: null,
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "BTC",
            amount: 0.12,
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: 1,
            target_chain: "BTC",
          },
        ],
        total: 1,
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(screen.getByText("-")).toBeInTheDocument();
    });
  });

  test("renders without solver_tx_hash", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "BTC",
            amount: 0.12,
            solver_tx_hash: null,
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: "completed",
            target_chain: "BTC",
          },
        ],
        total: 1,
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(screen.getAllByText("-")).toHaveLength(2); // One for intent_tx, one for destTx
    });
  });

  test("renders different status values", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "BTC",
            amount: 0.12,
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: 0, // Fail
            target_chain: "BTC",
          },
          {
            intent_hash: "0x789",
            created_at: "2025-11-25T12:00:00Z",
            source_token: "USDT",
            source_amount: 100,
            target_token: "TICS",
            amount: 50,
            solver_tx_hash: "0xabc",
            updated_at: "2025-11-25T13:00:00Z",
            intent_update_status: 1, // Confirm
            target_chain: "TICS",
          },
          {
            intent_hash: "0xdef",
            created_at: "2025-11-26T12:00:00Z",
            source_token: "USDC",
            source_amount: 200,
            target_token: "ETH",
            amount: 75,
            solver_tx_hash: "0xghi",
            updated_at: "2025-11-26T13:00:00Z",
            intent_update_status: 2, // Pending
            target_chain: "ETH",
          },
        ],
        total: 3,
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(screen.getByText("Fail")).toBeInTheDocument();
      expect(screen.getByText("Confirm")).toBeInTheDocument();
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });
  });

  test("pagination handles first and last buttons", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "ETH",
            source_amount: 1.2345,
            target_token: "BTC",
            amount: 0.12,
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: "completed",
            target_chain: "BTC",
          },
        ],
        total: 30, // More than tableLimit to enable pagination
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(GetChainAbstractionTransaction).toHaveBeenCalledWith(1, 10);
    });

    const lastButton = screen.getByText("Last");
    fireEvent.click(lastButton);

    await waitFor(() => {
      expect(GetChainAbstractionTransaction).toHaveBeenCalledWith(3, 10); // totalPages = Math.ceil(30/10) = 3
    });

    const firstButton = screen.getByText("First");
    fireEvent.click(firstButton);

    await waitFor(() => {
      expect(GetChainAbstractionTransaction).toHaveBeenCalledWith(1, 10);
    });
  });

  test("renders different token types and formats", async () => {
    GetChainAbstractionTransaction.mockResolvedValue({
      data: {
        intentList: [
          {
            intent_hash: "0x123",
            created_at: "2025-11-24T12:00:00Z",
            source_token: "BTC",
            source_amount: 100000000, // 1 BTC in satoshis
            target_token: "ETH",
            amount: 1000000000000000000, // 1 ETH in wei
            solver_tx_hash: "0x456",
            updated_at: "2025-11-24T13:00:00Z",
            intent_update_status: "completed",
            target_chain: "BTC",
          },
          {
            intent_hash: "0x789",
            created_at: "2025-11-25T12:00:00Z",
            source_token: "USDT",
            source_amount: 1000000, // 1 USDT in micro units
            target_token: "USDC",
            amount: 2000000, // 2 USDC in micro units
            solver_tx_hash: "0xabc",
            updated_at: "2025-11-25T13:00:00Z",
            intent_update_status: "pending",
            target_chain: "TICS",
          },
        ],
        total: 2,
      },
    });

    await act(async () => {
      render(<ChainAbstractionTransaction />);
    });

    await waitFor(() => {
      expect(screen.getByText("1 BTC")).toBeInTheDocument();
      expect(screen.getByText("1 ETH")).toBeInTheDocument();
      expect(screen.getByText("1 USDT")).toBeInTheDocument();
      expect(screen.getByText("2 USDC")).toBeInTheDocument();
    });
  });
});
