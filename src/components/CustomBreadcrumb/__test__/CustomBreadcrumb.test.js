import { render, screen } from "@testing-library/react";
import CustomBreadcrumb from "../CustomBreadcrumb";
import { Breadcrumb } from "antd";

// Mock SVG Icon Component
jest.mock("../../../../public/SvgIcons.js", () => ({
  BreadCrumbArrow: () => <div data-testid="breadcrumb-arrow" />,
}));

describe("CustomBreadcrumb Component", () => {
  const MockIcon = () => <div data-testid="mock-icon" />;

  const breadcrumbItems = [
    { label: "Home", href: "/home", icon: MockIcon },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: "/settings" },
  ];

  test("renders breadcrumb container", () => {
    render(
      <CustomBreadcrumb
        items={breadcrumbItems}
        activeIndex={1}
        activeClassName="active"
      />
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("applies active class to correct index", () => {
    const { container } = render(
      <CustomBreadcrumb
        items={breadcrumbItems}
        activeIndex={1}
        activeClassName="active"
      />
    );

    // Find the element that HAS the class
    const elementWithClass = container.querySelector(".active");
    expect(elementWithClass).toBeInTheDocument();
    expect(elementWithClass).toHaveTextContent("Dashboard");
  });

  test("does not apply active class to other items", () => {
    render(
      <CustomBreadcrumb
        items={breadcrumbItems}
        activeIndex={1}
        activeClassName="active"
      />
    );

    const homeItem = screen.getByText("Home").closest("li");
    const settingsItem = screen.getByText("Settings").closest("li");

    expect(homeItem).not.toHaveClass("active");
    expect(settingsItem).not.toHaveClass("active");
  });

  test("renders icons when provided", () => {
    render(
      <CustomBreadcrumb
        items={breadcrumbItems}
        activeIndex={0}
        activeClassName="active"
      />
    );

    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  test("renders breadcrumb separator icon", () => {
    render(
      <CustomBreadcrumb
        items={breadcrumbItems}
        activeIndex={0}
        activeClassName="active"
      />
    );

    expect(screen.getAllByTestId("breadcrumb-arrow").length).toBeGreaterThan(0);
  });

  test("applies href correctly", () => {
    render(
      <CustomBreadcrumb
        items={breadcrumbItems}
        activeIndex={0}
        activeClassName="active"
      />
    );

    const link = screen.getByText("Home").closest("a");
    expect(link).toHaveAttribute("href", "/home");
  });
});
