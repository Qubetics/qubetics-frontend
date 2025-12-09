import { render, screen } from "@testing-library/react";
import BlockDetail from "../BlockDetail";

describe("BlockDetail Component", () => {
  const mockDetails = [
    { img: <span>Icon1</span>, text: "Text1", heading: "Heading1" },
    { img: <span>Icon2</span>, text: "Text2", heading: "Heading2" },
  ];

  test("renders without crashing with details", () => {
    render(<BlockDetail details={mockDetails} />);
    
    // Check that both innerdata divs are rendered
    const innerDataDivs = screen.getAllByText(/Heading/i);
    expect(innerDataDivs.length).toBe(2);

    // Check that text is rendered
    expect(screen.getByText("Text1")).toBeInTheDocument();
    expect(screen.getByText("Heading1")).toBeInTheDocument();

    expect(screen.getByText("Text2")).toBeInTheDocument();
    expect(screen.getByText("Heading2")).toBeInTheDocument();

    // Check that img icons are rendered
    expect(screen.getByText("Icon1")).toBeInTheDocument();
    expect(screen.getByText("Icon2")).toBeInTheDocument();
  });

  test("applies centerBlocks class when centerBlocks prop is true", () => {
    const { container } = render(<BlockDetail details={mockDetails} centerBlocks />);
    const mainDiv = container.querySelector(".blockdetail");
    expect(mainDiv).toHaveClass("centerBlocks");
  });

  test("does not apply centerBlocks class when centerBlocks prop is false", () => {
    const { container } = render(<BlockDetail details={mockDetails} centerBlocks={false} />);
    const mainDiv = container.querySelector(".blockdetail");
    expect(mainDiv).not.toHaveClass("centerBlocks");
  });

  test("renders nothing if details prop is empty or undefined", () => {
    const { container: emptyContainer } = render(<BlockDetail details={[]} />);
    expect(emptyContainer.querySelectorAll(".innerdata").length).toBe(0);

    const { container: undefinedContainer } = render(<BlockDetail />);
    expect(undefinedContainer.querySelectorAll(".innerdata").length).toBe(0);
  });
});
