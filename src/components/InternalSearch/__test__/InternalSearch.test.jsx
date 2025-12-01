import { render, screen, fireEvent } from "@testing-library/react";
import InternalSearch from "../InternalSearch";
import { useThemeData } from "@/components/contexts/theme_context";

jest.mock("@/components/contexts/theme_context", () => ({
  useThemeData: jest.fn(),
}));

jest.mock("../../../../public/SvgIcons", () => ({
  Searchicon: () => <div data-testid="dark-icon" />,
  Searchicondark: () => <div data-testid="light-icon" />,
}));

describe("InternalSearch Component", () => {
  const mockChange = jest.fn();
  const mockKeyUp = jest.fn();

  it("renders input with given value", () => {
    useThemeData.mockReturnValue({ isLight: "lightTheme" });
    render(
      <InternalSearch
        searchText="hello"
        onChange={mockChange}
        onKeyUp={mockKeyUp}
      />
    );

    expect(screen.getByPlaceholderText(/search for contract/i)).toHaveValue(
      "hello"
    );
  });

  it("calls onChange when input changes", () => {
    useThemeData.mockReturnValue({ isLight: "lightTheme" });
    render(
      <InternalSearch
        searchText=""
        onChange={mockChange}
        onKeyUp={mockKeyUp}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "abc" },
    });

    expect(mockChange).toHaveBeenCalled();
  });

  it("calls onKeyUp when a key is pressed", () => {
    useThemeData.mockReturnValue({ isLight: "lightTheme" });
    render(
      <InternalSearch
        searchText=""
        onChange={mockChange}
        onKeyUp={mockKeyUp}
      />
    );

    fireEvent.keyUp(screen.getByPlaceholderText(/search/i), {
      key: "Enter",
    });

    expect(mockKeyUp).toHaveBeenCalled();
  });

  it("shows light icon when theme is light", () => {
    useThemeData.mockReturnValue({ isLight: "lightTheme" });

    render(
      <InternalSearch searchText="" onChange={mockChange} onKeyUp={mockKeyUp} />
    );

    expect(screen.getByTestId("light-icon")).toBeInTheDocument();
  });

  it("shows dark icon when theme is dark", () => {
    useThemeData.mockReturnValue({ isLight: "darkTheme" });

    render(
      <InternalSearch searchText="" onChange={mockChange} onKeyUp={mockKeyUp} />
    );

    expect(screen.getByTestId("dark-icon")).toBeInTheDocument();
  });
});
