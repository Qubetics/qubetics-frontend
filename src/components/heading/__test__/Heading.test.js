import { render, screen, fireEvent } from "@testing-library/react";
import Heading from "../Heading";

// Mock child components
jest.mock("../../commonbtn/CommonBluebtn", () => ({ text, onClick }) => (
    <button onClick={onClick}>{text}</button>
));
jest.mock("../../DoCopy/CopyText", () => ({ text }) => <div>{text}</div>);

describe("Heading Component", () => {
    it("renders heading text", () => {
        render(<Heading heading="My Heading" />);
        expect(screen.getByText("My Heading")).toBeInTheDocument();
    });

    it("renders status when provided", () => {
        render(<Heading heading="Test" status="active" />);
        expect(screen.getByText("Active")).toBeInTheDocument();

        render(<Heading heading="Test" status="inactive" />);
        expect(screen.getByText("Inactive")).toBeInTheDocument();
    });

    it("renders button when 'button' prop is true and calls onClick", () => {
        const handleClick = jest.fn();
        render(<Heading heading="Test" button={true} onClick={handleClick} />);

        const button = screen.getByText("View All");
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(handleClick).toHaveBeenCalled();
    });

    it("renders address section when 'addresspage' and 'address' props are provided", () => {
        render(
            <Heading heading="Test" addresspage={true} address="0x123" />
        );
        expect(screen.getByText("Address")).toBeInTheDocument();
        const addressElements = screen.getAllByText("0x123");
        expect(addressElements).toHaveLength(2); // One in <p> and one in mocked CopyText
    });

    it("does not render button or address section when props are false/undefined", () => {
        render(<Heading heading="Test" />);
        expect(screen.queryByText("View All")).not.toBeInTheDocument();
        expect(screen.queryByText("Address")).not.toBeInTheDocument();
    });
});
