import { render, screen } from "@testing-library/react";
import ChainAnalytics from "./../ChainAnalytics";
import { useLatestData } from "@/components/contexts/latest_data";
import { useThemeData } from "@/components/contexts/theme_context";

// Mock the hooks and components
jest.mock("@/components/contexts/latest_data");
jest.mock("@/components/contexts/theme_context");
jest.mock("@/components/cardOnChain/CardsOnchain", () =>
  jest.fn(({ text, balance }) => (
    <div data-testid={`card-${text}`}>
      <span>{text}</span>
      <span>{balance}</span>
    </div>
  ))
);

jest.mock("../../common/useAverageBlockTime", () => () => ({
  diffs: [5, 6, 7],
}));

describe("ChainAnalytics Component", () => {
  const stats = {
    circulationSupply: 1000000,
    totalValidator: 50,
    apy: 12.5,
    total_accounts: 200000,
    validators: 40,
    circulation_supply: 900000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all CardsOnchain components with correct data", () => {
    useLatestData.mockReturnValue({
      analytics: { validatorData: JSON.stringify({ apy: 15 }), count: 50000 },
    });
    useThemeData.mockReturnValue({ isLight: "lightTheme" });

    render(<ChainAnalytics stats={stats} />);

    // Check that all cards are rendered
    expect(screen.getByTestId("card-Average Block Time")).toBeInTheDocument();
    expect(screen.getByTestId("card-Circulating Supply")).toBeInTheDocument();
    expect(screen.getByTestId("card-Total Validators")).toBeInTheDocument();
    expect(screen.getByTestId("card-Average APY")).toBeInTheDocument();
    expect(
      screen.getByTestId("card-Total Active Accounts")
    ).toBeInTheDocument();

    // Check that values are rendered correctly
    expect(screen.getByTestId("card-Average Block Time")).toHaveTextContent(
      "Average Block Time6.00 Sec"
    );
    expect(screen.getByTestId("card-Circulating Supply")).toHaveTextContent(
      "Circulating Supply1 M"
    );
    expect(screen.getByTestId("card-Total Validators")).toHaveTextContent(
      "Total Validators50"
    );
    expect(screen.getByTestId("card-Average APY")).toHaveTextContent(
      "Average APY15 %"
    );
    expect(screen.getByTestId("card-Total Active Accounts")).toHaveTextContent(
      "Total Active Accounts50 K"
    );
  });

  test("handles dark theme correctly", () => {
    useLatestData.mockReturnValue({
      analytics: { validatorData: JSON.stringify({ apy: 15 }), count: 50000 },
    });
    useThemeData.mockReturnValue({ isLight: "darkTheme" });

    render(<ChainAnalytics stats={stats} />);

    expect(screen.getByTestId("card-Average Block Time")).toBeInTheDocument();
    // Further tests can be added for image/icon change if needed
  });

  test("uses fallback values if stats or webSocketData missing", () => {
    useLatestData.mockReturnValue({});
    useThemeData.mockReturnValue({ isLight: "lightTheme" });

    render(<ChainAnalytics stats={{}} />);

    expect(screen.getByTestId("card-Average Block Time")).toHaveTextContent(
      "Average Block Time6.00 Sec"
    );
    expect(screen.getByTestId("card-Average APY")).toHaveTextContent(
      "Average APY0 %"
    );
  });
});
