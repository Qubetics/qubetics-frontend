import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "../Footer";
import { trackEvent } from "@/utils/eventTrack";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/test")
}));

jest.mock("@/utils/eventTrack", () => ({
  trackEvent: jest.fn()
}));

jest.mock("../config/FooterLinks", () => ({
  footerLinks: [
    {
      title: "Section 1",
      items: [
        { label: "Docs", href: "/docs", external: false },
        { label: "Tokens", href: "/tokens", external: false },
        { label: "Disabled", href: "#", disabled: true }
      ]
    }
  ],
  SocialMediaLinks: [
    {
      label: "Twitter",
      href: "https://twitter.com",
      icon: (() => {
        const React = require("react");
        return React.createElement("div", { "data-testid": "icon" });
      })()
    }
  ]
}));

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(() => "EVM Chain")
  },
  writable: true
});

describe("Footer Component", () => {
  test("renders footer content", () => {
    render(<Footer />);
    expect(screen.getByText(/Build without limits/i)).toBeInTheDocument();
  });

  test("renders footer links", () => {
    render(<Footer />);
    expect(screen.getByText("Docs")).toBeInTheDocument();
  });

  test("hides Tokens when chainType = Native Chain", () => {
    window.localStorage.getItem = jest.fn(() => "Native Chain");
    render(<Footer />);
    expect(screen.queryByText("Tokens")).toBeNull();
  });

  test("renders disabled link", () => {
    render(<Footer />);
    expect(screen.getByText("Disabled")).toBeInTheDocument();
  });

  test("tracks click events on links", () => {
    render(<Footer />);
    fireEvent.click(screen.getByText("Docs"));
    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Docs" })
    );
  });

  test("renders social media icons and triggers tracking", () => {
    render(<Footer />);
    fireEvent.click(screen.getByTestId("icon"));
    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Twitter" })
    );
  });

  test("renders copyright year", () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
