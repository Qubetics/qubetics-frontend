import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ListView from "../ListView";
import { FetchingStatus, InitStatus, SuccessStatus, tableLimit } from "@/constant/constant";

// Mock SVG
jest.mock("../../../../public/SvgIcons", () => ({
  Datnotfound: () => <div data-testid="no-data-svg">SVG</div>,
}));

// Mock Pagination component
jest.mock("../../Pagination/Pagination", () => (props) => (
  <div>
    <button
      data-testid="prev-btn"
      disabled={props.disablePrev}
      onClick={props.handlePrevious}
    >
      Prev
    </button>
    <button
      data-testid="next-btn"
      disabled={props.disableNext}
      onClick={props.handleNext}
    >
      Next
    </button>
    <button data-testid="first-btn" onClick={props.handleFirst}>First</button>
    <button data-testid="last-btn" onClick={props.handleLast}>Last</button>
    <span data-testid="current-page">{props.currentPage}</span>
  </div>
));

// Mock SkeletonTableWrapper
jest.mock("../../SkeletonTableWrapper/SkeletonTableWrapper", () => ({
  SkeletonTableWrapper: ({ isSkeleton, dataSource, locale }) => (
    <div
      data-testid={
        isSkeleton ? "skeleton" : dataSource && dataSource.length === 0 ? "empty" : "table"
      }
    >
      {isSkeleton ? (
        "Skeleton"
      ) : dataSource && dataSource.length === 0 ? (
        <div>{locale && locale.emptyText}</div>
      ) : (
        "Table"
      )}
    </div>
  ),
}));

describe("ListView Component", () => {

  test("shows skeleton loader when status is InitStatus", () => {
    render(
      <ListView nodesData={[]} nodesStatus={InitStatus} totalNodes={0} />
    );

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  test("shows skeleton loader when status is FetchingStatus", () => {
    render(
      <ListView nodesData={[]} nodesStatus={FetchingStatus} totalNodes={0} />
    );

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  test("shows 'No data' message when list is empty", () => {
    render(
      <ListView nodesData={[]} nodesStatus={SuccessStatus} totalNodes={0} />
    );

    expect(screen.getByTestId("no-data-svg")).toBeInTheDocument();
    expect(screen.getByText(/No data/i)).toBeInTheDocument();
  });

  test("renders paginated results and shows table", () => {
    const mockData = Array.from({ length: 20 }, (_, i) => ({ id: i + 1 }));

    render(
      <ListView nodesData={mockData} nodesStatus={SuccessStatus} totalNodes={20} />
    );

    // Table should render
    expect(screen.getByTestId("table")).toBeInTheDocument();

    // Pagination should be visible because > 10
    expect(screen.getByTestId("next-btn")).toBeInTheDocument();
  });

  test("pagination: clicking next increases page number", () => {
    const mockData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    render(
      <ListView nodesData={mockData} nodesStatus={SuccessStatus} totalNodes={25} />
    );

    const nextBtn = screen.getByTestId("next-btn");
    const currentPage = screen.getByTestId("current-page");

    expect(currentPage.textContent).toBe("1");

    fireEvent.click(nextBtn);
    expect(currentPage.textContent).toBe("2");
  });

  test("pagination: clicking previous decreases page number", () => {
    const mockData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    render(<ListView nodesData={mockData} nodesStatus={SuccessStatus} totalNodes={25} />);

    const nextBtn = screen.getByTestId("next-btn");
    const prevBtn = screen.getByTestId("prev-btn");
    const currentPage = screen.getByTestId("current-page");

    fireEvent.click(nextBtn); // go to page 2
    expect(currentPage.textContent).toBe("2");

    fireEvent.click(prevBtn); // back to page 1
    expect(currentPage.textContent).toBe("1");
  });

  test("pagination: clicking first goes to page 1", () => {
    const mockData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    render(<ListView nodesData={mockData} nodesStatus={SuccessStatus} totalNodes={25} />);

    const nextBtn = screen.getByTestId("next-btn");
    const firstBtn = screen.getByTestId("first-btn");
    const currentPage = screen.getByTestId("current-page");

    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    expect(currentPage.textContent).toBe("3");

    fireEvent.click(firstBtn);
    expect(currentPage.textContent).toBe("1");
  });

  test("pagination: clicking last goes to last page", () => {
    const mockData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

    render(<ListView nodesData={mockData} nodesStatus={SuccessStatus} totalNodes={25} />);

    const lastBtn = screen.getByTestId("last-btn");
    const currentPage = screen.getByTestId("current-page");

    fireEvent.click(lastBtn);
    expect(currentPage.textContent).toBe(String(Math.ceil(25 / tableLimit)));
  });

});
