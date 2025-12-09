import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FileUpload from "./../FileUpload";

// Mock toast
jest.mock("react-hot-toast", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("FileUpload Component", () => {
  const mockSetSelectedFiles = jest.fn();
  const mockOnChange = jest.fn();

  const renderComponent = (selectedFiles = []) =>
    render(
      <FileUpload
        selectedFiles={selectedFiles}
        setSelectedFiles={mockSetSelectedFiles}
        onChange={mockOnChange}
      />
    );

  const createMockFile = (name, type, sizeMB) =>
    new File(["x".repeat(sizeMB * 1024 * 1024)], name, {
      type,
    });

  beforeAll(() => {
    // Mock DataTransfer for file uploads in tests
    global.DataTransfer = class {
      constructor() {
        this.items = {
          add: (file) => {
            this.files.push(file);
          },
        };
        this.files = [];
      }
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders upload label", () => {
    renderComponent();
    expect(screen.getByText(/Upload Files/i)).toBeInTheDocument();
  });

  test("accepts valid image files and updates state", () => {
    renderComponent([]);

    const input = screen.getByLabelText(
      "Upload Files (Max: 4 files, 2MB each)"
    );

    const file = createMockFile("test.png", "image/png", 1);

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockSetSelectedFiles).toHaveBeenCalledWith([file]);
    expect(mockOnChange).toHaveBeenCalledWith([file]);
  });

  test("shows toast for invalid file type", () => {
    const { toast } = require("react-hot-toast");

    renderComponent([]);

    const input = screen.getByLabelText(/Upload Files/i);

    const invalidFile = createMockFile("file.pdf", "application/pdf", 1);

    fireEvent.change(input, { target: { files: [invalidFile] } });

    expect(toast.error).toHaveBeenCalledWith(
      "file.pdf is not a valid image format (JPEG, JPG, PNG)."
    );
  });

  test("shows toast for file too large (>2MB)", async () => {
    const { toast } = require("react-hot-toast");

    renderComponent([]);

    const input = screen.getByLabelText(
      "Upload Files (Max: 4 files, 2MB each)"
    );

    const largeFile = createMockFile("large.png", "image/png", 3);

    await userEvent.upload(input, largeFile);

    expect(toast.error).toHaveBeenCalledWith(
      "large.png exceeds the 2MB size limit."
    );
  });

  test("limits uploads to max 4 files", () => {
    const { toast } = require("react-hot-toast");

    renderComponent([]);

    const input = screen.getByLabelText(
      "Upload Files (Max: 4 files, 2MB each)"
    );

    const files = [
      createMockFile("a.png", "image/png", 1),
      createMockFile("b.png", "image/png", 1),
      createMockFile("c.png", "image/png", 1),
      createMockFile("d.png", "image/png", 1),
      createMockFile("e.png", "image/png", 1),
    ];

    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));

    fireEvent.change(input, { target: { files: dt.files } });

    expect(toast.error).toHaveBeenCalledWith(
      "You can only upload up to 4 files."
    );
    expect(mockSetSelectedFiles).not.toHaveBeenCalled();
  });

  test("removes a file on delete button click", () => {
    const files = [
      createMockFile("a.png", "image/png", 1),
      createMockFile("b.png", "image/png", 1),
    ];

    renderComponent(files);

    const deleteButtons = screen.getAllByRole("button");

    fireEvent.click(deleteButtons[0]);

    expect(mockSetSelectedFiles).toHaveBeenCalledWith([files[1]]);
  });

  test("disables input when max files reached", () => {
    const files = [
      createMockFile("a.png", "image/png", 1),
      createMockFile("b.png", "image/png", 1),
      createMockFile("c.png", "image/png", 1),
      createMockFile("d.png", "image/png", 1),
    ];

    renderComponent(files);

    const input = screen.getByLabelText(
      "Upload Files (Max: 4 files, 2MB each)"
    );

    expect(input).toBeDisabled();
  });

  test("displays selected file names", () => {
    const files = [
      createMockFile("test1.png", "image/png", 1),
      createMockFile("test2.jpg", "image/jpeg", 1),
    ];

    renderComponent(files);

    expect(screen.getByText("test1.png (1.00 MB)")).toBeInTheDocument();
    expect(screen.getByText("test2.jpg (1.00 MB)")).toBeInTheDocument();
  });
});
