import { render, screen } from "@testing-library/react";
import CardsOnchain from "./../CardsOnchain";

// Mock CountdownTimer to simplify test
jest.mock("@/components/countdown/CountdownTimer", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="countdown-timer" />),
}));

describe("CardsOnchain Component", () => {
  const defaultProps = {
    text: "Test Text",
    balance: "100",
    title: "Tooltip text",
    img: <div data-testid="img-icon" />,
    className: "custom-class",
    countTimer: false,
    hideTooltip: false,
    addicon: true,
    contract: true,
    countime: true,
    iconCopy2: true,
  };

  test("renders text, balance, and image", () => {
    render(<CardsOnchain {...defaultProps} />);

    expect(screen.getByText("Test Text")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByTestId("img-icon")).toBeInTheDocument();
  });

  test("shows tooltip when hideTooltip is false", () => {
    render(<CardsOnchain {...defaultProps} />);
    const icons = screen.getAllByRole("img", { name: /info/i });
    expect(icons.length).toBeGreaterThan(0);
  });

  test("hides tooltip when hideTooltip is true", () => {
    render(
      <CardsOnchain {...defaultProps} hideTooltip={true} iconCopy2={false} />
    );
    expect(
      screen.queryByRole("img", { name: /info/i })
    ).not.toBeInTheDocument();
  });

  test("renders CountdownTimer when countTimer is true", () => {
    render(<CardsOnchain {...defaultProps} countTimer={true} />);
    expect(screen.getByTestId("countdown-timer")).toBeInTheDocument();
  });

  test("applies custom classes based on props", () => {
    const { container } = render(<CardsOnchain {...defaultProps} />);
    const card = container.querySelector(".marcketCapCard");
    expect(card).toHaveClass("custom-class");
    expect(card).toHaveClass("addicon");
    expect(card).toHaveClass("contract");
    expect(card).toHaveClass("countime");
  });
});
