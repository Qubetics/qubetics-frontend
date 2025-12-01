import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";

// ---- MOCK CONTEXT ----
const mockContext = {
  contractAddress: "",
  setContractAddress: jest.fn(),
  formData: {
    compilerType: "",
    compilerVersion: "",
    licenseType: "",
  },
  setFormData: jest.fn(),
  resetState: false,
  setSolidityCode: jest.fn(),
  setFileList: jest.fn(),
  setRunCheck: jest.fn(),
  setInputs: jest.fn(),
  setVerifyAddress: jest.fn(),
  verifyAddress: "",
  setResetState: jest.fn(),
  setIsContractExist: jest.fn(),
  setIsCheck: jest.fn(),
  setIsCheckedMessage: jest.fn(),
};

jest.mock("../contexts/contractContext", () => ({
  useContractData: () => mockContext,
}));

// ---- MOCK SERVICES ----
jest.mock("@/services/getCompilerVersion", () =>
  jest.fn(() =>
    Promise.resolve({
      builds: [
        { longVersion: "0.8.20" },
        { longVersion: "0.8.19-nightly" },
        { longVersion: "0.8.18" },
      ],
    })
  )
);

jest.mock("@/services/getContractDetails", () =>
  jest.fn(() => Promise.resolve({ error: false }))
);

jest.mock("@/services/getContractVeriicationDetail", () =>
  jest.fn(() => Promise.resolve(null))
);

// ---- COMPONENT ----
import PublishContract from "./PublishContract";

// ---- MOCK NEXT LINK ----
jest.mock("next/link", () => ({ children }) => <a>{children}</a>);

// ---- MOCK TOAST ----
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}));

describe("PublishContract Component", () => {
  const mockSteps = [1, 2];
  const mockNext = jest.fn();
  const mockPrev = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock context to initial state
    mockContext.contractAddress = "";
    mockContext.verifyAddress = "";
    mockContext.formData = {
      compilerType: "",
      compilerVersion: "",
      licenseType: "",
    };
    mockContext.resetState = false;
  });

  test("renders contract input field", async () => {
    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });
    expect(screen.getByPlaceholderText(/0xF024/i)).toBeInTheDocument();
  });

  test("updates contract address on input change", async () => {
    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    const input = screen.getByPlaceholderText(/0xF024/i);

    fireEvent.change(input, { target: { value: "0x1234" } });

    expect(mockContext.setContractAddress).toHaveBeenCalledWith("0x1234");
  });

  test("shows error when clicking Next without filling required fields", async () => {
    render(
      <PublishContract
        steps={mockSteps}
        current={0}
        next={mockNext}
        prev={mockPrev}
      />
    );

    const nextButton = screen.getByText("Next");

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(require("react-toastify").toast.error).toHaveBeenCalledWith(
        "Please fill in all required fields"
      );
    });
  });

  test("checkbox must be checked before proceeding", async () => {
    mockContext.contractAddress = "0x12345";
    mockContext.formData = {
      compilerType: "solidity",
      compilerVersion: "v0.8.20",
      licenseType: "MIT",
    };

    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    const nextButton = screen.getByText("Next");

    await act(async () => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(
        screen.getByText("Please check the Terms of Service")
      ).toBeInTheDocument();
    });
  });

  test("clicking Next triggers next() when valid", async () => {
    mockContext.formData = {
      compilerType: "solidity",
      compilerVersion: "v0.8.20",
      licenseType: "MIT",
    };

    mockContext.contractAddress = "0x12345";

    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    const checkBox = screen.getByRole("checkbox");
    fireEvent.click(checkBox);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockNext).toHaveBeenCalled();
    });
  });

  test("handles resetState useEffect", async () => {
    mockContext.resetState = true;
    mockContext.contractAddress = "0x12345";
    mockContext.formData = {
      compilerType: "solidity",
      compilerVersion: "v0.8.20",
      licenseType: "MIT",
    };

    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    expect(mockContext.setContractAddress).toHaveBeenCalledWith("");
    expect(mockContext.setFormData).toHaveBeenCalledWith("");
    expect(mockContext.setSolidityCode).toHaveBeenCalledWith("");
    expect(mockContext.setFileList).toHaveBeenCalledWith("");
    expect(mockContext.setInputs).toHaveBeenCalledWith("");
    expect(mockContext.setVerifyAddress).toHaveBeenCalledWith("");
    expect(mockContext.setResetState).toHaveBeenCalledWith(false);
  });

  test("handles verifyAddress useEffect", async () => {
    mockContext.verifyAddress = "0x67890";

    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    await waitFor(() => {
      expect(mockContext.setVerifyAddress).toHaveBeenCalledWith("0x67890");
    });
  });

  test("shows Done button on last step", async () => {
    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={1}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  test("shows Previous button when not first step", async () => {
    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={1}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    const prevButton = screen.getByText("Previous");
    fireEvent.click(prevButton);

    expect(mockPrev).toHaveBeenCalled();
  });

  test("handles contract verification in progress", async () => {
    jest
      .mocked(require("@/services/getContractVeriicationDetail"))
      .mockResolvedValueOnce({
        verificationType: 0,
      });

    mockContext.formData = {
      compilerType: "solidity",
      compilerVersion: "v0.8.20",
      licenseType: "MIT",
    };
    mockContext.contractAddress = "0x12345";

    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    const checkBox = screen.getByRole("checkbox");
    fireEvent.click(checkBox);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(require("react-toastify").toast.success).toHaveBeenCalledWith(
        "Contract Verification in Process"
      );
    });
  });

  test("handles contract already verified", async () => {
    jest
      .mocked(require("@/services/getContractVeriicationDetail"))
      .mockResolvedValueOnce({
        verificationType: 1,
      });

    mockContext.formData = {
      compilerType: "solidity",
      compilerVersion: "v0.8.20",
      licenseType: "MIT",
    };
    mockContext.contractAddress = "0x12345";

    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    const checkBox = screen.getByRole("checkbox");
    fireEvent.click(checkBox);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(require("react-toastify").toast.success).toHaveBeenCalledWith(
        "Contract Already Verified"
      );
    });
  });

  test("renders error message for invalid contract", async () => {
    jest
      .mocked(require("@/services/getContractDetails"))
      .mockResolvedValueOnce({ error: true });

    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    const input = screen.getByPlaceholderText(/0xF024/i);
    fireEvent.change(input, { target: { value: "invalid" } });

    await waitFor(() => {
      expect(screen.getByText("Invalid Contract Address")).toBeInTheDocument();
    });
  });

  test("renders with verifyAddress prop", async () => {
    mockContext.verifyAddress = "0x67890";

    await act(async () => {
      render(
        <PublishContract
          steps={mockSteps}
          current={0}
          next={mockNext}
          prev={mockPrev}
        />
      );
    });

    const input = screen.getByPlaceholderText(/0xF024/i);
    expect(input).toHaveAttribute("disabled");
    expect(input).toHaveValue("0x67890");
  });
});
