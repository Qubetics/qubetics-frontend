import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../Pagination";

describe("Pagination Component", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      totalPages: 5,
      currentPage: 2,
      handleNext: jest.fn(),
      handlePrevious: jest.fn(),
      disablePrev: false,
      disableNext: false,
      handleFirst: jest.fn(),
      handleLast: jest.fn(),
    };

    return render(<Pagination {...defaultProps} {...props} />);
  };

  test("renders current page and total pages", () => {
    setup();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  test("previous button triggers handlePrevious", () => {
    const handlePrevious = jest.fn();
    setup({ handlePrevious });

    const prevButton = screen.getAllByRole("img")[1]; // LeftOutlined icon div
    fireEvent.click(prevButton);

    expect(handlePrevious).toHaveBeenCalled();
  });

  test("next button triggers handleNext", () => {
    const handleNext = jest.fn();
    setup({ handleNext });

    const nextButton = screen.getAllByRole("img")[2]; // RightOutlined icon div
    fireEvent.click(nextButton);

    expect(handleNext).toHaveBeenCalled();
  });

  test("first page button disabled when currentPage = 1", () => {
    const handleFirst = jest.fn();

    setup({
      currentPage: 1,
      disablePrev: true,
      handleFirst,
    });

    const firstBtn = screen.getAllByRole("img")[0];

    fireEvent.click(firstBtn);

    // should NOT call handleFirst because disabled
    expect(handleFirst).not.toHaveBeenCalled();
  });

  test("last page button disabled when currentPage = totalPages", () => {
    const handleLast = jest.fn();

    setup({
      currentPage: 5,
      totalPages: 5,
      disableNext: true,
      handleLast,
    });

    const lastBtn = screen.getAllByRole("img")[3];

    fireEvent.click(lastBtn);

    // should NOT call handleLast
    expect(handleLast).not.toHaveBeenCalled();
  });

  test("first button triggers handleFirst when active", () => {
    const handleFirst = jest.fn();
    setup({ handleFirst, currentPage: 2 });

    const firstBtn = screen.getAllByRole("img")[0];
    fireEvent.click(firstBtn);

    expect(handleFirst).toHaveBeenCalled();
  });

  test("last button triggers handleLast when active", () => {
    const handleLast = jest.fn();
    setup({ handleLast, currentPage: 2 });

    const lastBtn = screen.getAllByRole("img")[3];
    fireEvent.click(lastBtn);

    expect(handleLast).toHaveBeenCalled();
  });
});
