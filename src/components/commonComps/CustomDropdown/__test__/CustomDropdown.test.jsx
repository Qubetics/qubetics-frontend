import { render, screen, fireEvent } from "@testing-library/react";
import CustomDropdown from "../CustomDropdown";

describe("CustomDropdown Component", () => {
  const options = ["Option 1", "Option 2", "Option 3"];

  test("renders correctly with placeholder", () => {
    render(<CustomDropdown options={options} placeholder="Select item" />);

    expect(screen.getByText("Select item")).toBeInTheDocument();
  });

  test("renders label when provided", () => {
    render(
      <CustomDropdown
        options={options}
        label="Test Label"
        placeholder="Select item"
      />
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  test("opens dropdown on header click", () => {
    render(<CustomDropdown options={options} />);

    const header = screen.getByText("Select an option");

    fireEvent.click(header);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  test("calls onSelect when option is clicked", () => {
    const handleSelect = jest.fn();

    render(
      <CustomDropdown
        options={options}
        onSelect={handleSelect}
        placeholder="Pick"
      />
    );

    fireEvent.click(screen.getByText("Pick")); // open dropdown
    fireEvent.click(screen.getByText("Option 2"));

    expect(handleSelect).toHaveBeenCalledWith("Option 2");
  });

  test("selected option gets highlighted", () => {
    render(
      <CustomDropdown options={options} value="Option 2" placeholder="Pick" />
    );

    fireEvent.click(screen.getByText("Option 2")); // open dropdown

    const selectedItems = screen.getAllByText("Option 2");
    const selectedItem = selectedItems.find((item) => item.tagName === "LI");

    expect(selectedItem.classList.contains("selected")).toBe(true);
  });

  test("closes dropdown on outside click", () => {
    render(<CustomDropdown options={options} />);

    fireEvent.click(screen.getByText("Select an option")); // open dropdown
    expect(screen.getByText("Option 1")).toBeInTheDocument();

    // simulate outside click
    fireEvent.mouseDown(document.body);

    // dropdown should close → list removed
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
  });
});
