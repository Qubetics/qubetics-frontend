import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  ThemeProvider,
  useThemeData,
} from "../theme_context";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

describe("ThemeProvider", () => {
  let mockPush;

  beforeEach(() => {
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => "light");

    // Mock Router
    mockPush = jest.fn();

    const useRouter = require("next/navigation").useRouter;
    useRouter.mockReturnValue({ push: mockPush });

    // Mock Pathname
    const usePathname = require("next/navigation").usePathname;
    usePathname.mockReturnValue("/dashboard");

    // Mock scrollTo
    window.scrollTo = jest.fn();
  });

  const TestComponent = () => {
    const { showDiv, toggleDiv, isLight } = useThemeData();

    return (
      <>
        <div data-testid="showDiv">{showDiv.toString()}</div>
        <div data-testid="isLight">{isLight.toString()}</div>
        <button onClick={toggleDiv}>ToggleDiv</button>
      </>
    );
  };

  test("loads theme from localStorage on mount", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(localStorage.getItem).toHaveBeenCalledWith("appTheme");
    expect(screen.getByTestId("isLight").textContent).toBe("light");
  });

  test("toggleDiv scrolls to top & navigates to HOME if not already on HOME", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByText("ToggleDiv"));

    // Should hide div
    expect(screen.getByTestId("showDiv").textContent).toBe("false");

    // Should scroll to top
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);

    // Should navigate because pathname is NOT HOME
    expect(mockPush).toHaveBeenCalledWith("/"); // Routes.HOME
  });

  test("toggleDiv should NOT navigate if already on HOME", async () => {
    const usePathname = require("next/navigation").usePathname;
    usePathname.mockReturnValue("/"); // HOME

    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await user.click(screen.getByText("ToggleDiv"));

    expect(mockPush).not.toHaveBeenCalled();
  });
});
