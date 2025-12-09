import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../header";
import { useThemeData } from "../../contexts/theme_context";
import { useGetNetwork } from "../../contexts/networkChanged";
import { useLatestData } from "../../contexts/latest_data";
import { useRouter, usePathname } from "next/navigation";

jest.mock("../../contexts/theme_context", () => ({
  useThemeData: jest.fn(),
}));

jest.mock("../../contexts/networkChanged", () => ({
  useGetNetwork: jest.fn(),
}));

jest.mock("../../contexts/latest_data", () => ({
  useLatestData: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("next/link", () => {
  return function Link({ children, href, onClick }) {
    return <a href={href} onClick={onClick}>{children}</a>;
  };
});

jest.mock("next/image", () => {
  return function Image(props) {
    return <img {...props} />;
  };
});

jest.mock("../HeaderMenu", () => {
  return function HeaderMenu({ onCloseDrawer }) {
    return <div data-testid="header-menu">HeaderMenu</div>;
  };
});

jest.mock("../../../../public/SvgIcons", () => ({
  HamburgerIcon: () => <svg role="img" aria-label="hamburger">Hamburger</svg>,
}));

jest.mock("@/utils/eventTrack", () => ({
  trackEvent: jest.fn(),
}));

jest.mock("antd", () => ({
  Drawer: ({ open, onClose, children }) =>
    open ? (
      <div data-testid="drawer">
        <button data-testid="drawer-close" onClick={onClose}>
          close
        </button>
        {children}
      </div>
    ) : null,
}));

global.localStorage = {
  getItem: jest.fn(() => "darkTheme"),
  setItem: jest.fn(),
};

describe("Header Component", () => {
  const mockRouter = { push: jest.fn() };
  const mockTheme = {
    isLight: "darkTheme",
    setIsLight: jest.fn(),
    showDiv: false,
    setShowDiv: jest.fn(),
  };
  const mockNetwork = {
    setIsNetworkChanged: jest.fn(),
    setIsEvm: jest.fn(),
  };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useThemeData.mockReturnValue(mockTheme);
    useGetNetwork.mockReturnValue(mockNetwork);
    useLatestData.mockReturnValue({});
    usePathname.mockReturnValue("/dashboard");
    window.innerWidth = 1400;
  });

  it("renders header", () => {
    render(<Header />);
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
  });

  it("opens and closes drawer", () => {
    render(<Header />);

    fireEvent.click(screen.getByLabelText("hamburger")); // hamburger icon SVG

    expect(screen.getByTestId("drawer")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("drawer-close"));
    expect(screen.queryByTestId("drawer")).not.toBeInTheDocument();
  });

  it("navigates to dashboard when logo clicked", () => {
    const { trackEvent } = require("@/utils/eventTrack");
    render(<Header />);

    fireEvent.click(screen.getByAltText("Logo"));

    expect(trackEvent).toHaveBeenCalledWith({
      action: "logo_click",
      category: "Header",
      label: "Logo",
    });
  });

  it("shows small logo when width < 1200", () => {
    window.innerWidth = 500;
    render(<Header />);
    expect(screen.getByAltText("Logo")).toHaveAttribute("width", "36");
  });

  it("shows route text for mobile", () => {
    window.innerWidth = 500;
    usePathname.mockReturnValue("/blocks");

    render(<Header />);

    expect(screen.getByText("Blockchain")).toBeInTheDocument();
  });
});
