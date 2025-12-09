import { render, screen, act } from "@testing-library/react";
import CountdownTimer from "../CountdownTimer";
import { randomNoGenerator } from "@/utils/commonFunctions";

// Mock external library
jest.mock("react-countdown-circle-timer", () => ({
  CountdownCircleTimer: ({ children }) => (
    <div data-testid="circle-timer">
      {children({ remainingTime: 5 })}
    </div>
  ),
}));

// Mock random generator
jest.mock("@/utils/commonFunctions", () => ({
  randomNoGenerator: jest.fn(),
}));

describe("CountdownTimer Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    randomNoGenerator.mockReturnValue(10); // default mock
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test("renders CountdownCircleTimer with correct props", () => {
    render(<CountdownTimer time={30} />);

    expect(screen.getByTestId("circle-timer")).toBeInTheDocument();
  });

  test("renders initial random value from renderTime()", () => {
    render(<CountdownTimer time={30} />);

    // randomNoGenerator() initially returns 10
    expect(screen.getByText("10 Sec")).toBeInTheDocument();
    expect(screen.getByText("Round Time")).toBeInTheDocument();
  });

  test("updates random value every second", () => {
    randomNoGenerator.mockReturnValueOnce(10).mockReturnValueOnce(20);

    render(<CountdownTimer time={30} />);

    expect(screen.getByText("10 Sec")).toBeInTheDocument();

    // Advance 1 second so timeout triggers
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // New value should now be on screen
    expect(screen.getByText("20 Sec")).toBeInTheDocument();
  });

  test("shows countertext when provided", () => {
    render(<CountdownTimer time={30} countertext="Timer Running" />);

    expect(screen.getByText("Timer Running")).toBeInTheDocument();
  });

  test("does not show countertext when not provided", () => {
    render(<CountdownTimer time={30} />);

    expect(screen.queryByText("Timer Running")).not.toBeInTheDocument();
  });
});
