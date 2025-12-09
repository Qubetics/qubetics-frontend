import { render, screen } from "@testing-library/react";
import CardSkeleton from "./../CardSkeleton";

describe("CardSkeleton Component", () => {
  test("renders without crashing", () => {
    render(<CardSkeleton />);
    const skeletonElement = screen.getByTestId("card-skeleton");
    expect(skeletonElement).toBeInTheDocument();
  });

  test("has correct class names", () => {
    const { container } = render(<CardSkeleton />);
    const mainDiv = container.querySelector(".tableLoader.cardLoader");
    expect(mainDiv).toBeInTheDocument();
  });

  test("contains Skeleton component", () => {
    render(<CardSkeleton />);
    // Check for the ant-skeleton class or the avatar span
    const skeletonAvatar = screen.getByText("", {
      selector: ".ant-skeleton-avatar",
    });
    expect(skeletonAvatar).toBeInTheDocument();
  });
});
