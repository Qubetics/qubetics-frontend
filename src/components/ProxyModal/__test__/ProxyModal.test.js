/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProxyModal from "../ProxyModal"; 
import saveProxy from "@/services/saveProxy";
import { toast } from "react-toastify";
import { CONTARCT_NULL_ADDRESS } from "@/constant/constant";

// Mock dependencies
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn() },
}));

jest.mock("@/services/saveProxy", () => jest.fn());

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    Modal: ({ open, children, onOk, onCancel, okText, cancelText }) =>
      open ? (
        <div data-testid="mock-modal">
          <button data-testid="ok-btn" onClick={onOk}>
            {okText || "OK"}
          </button>
          <button data-testid="cancel-btn" onClick={onCancel}>
            {cancelText || "Cancel"}
          </button>
          {children}
        </div>
      ) : null,
  };
});

jest.mock("next/link", () => {
  return ({ children }) => <a>{children}</a>;
});

describe("ProxyModal Component", () => {
  const defaultProps = {
    isModalOpen: true,
    setIsModalOpen: jest.fn(),
    implementationAddress: "0x12345",
    proxyVerified: 1,
    hash: "0xHASH",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("renders modal when open", () => {
    render(<ProxyModal {...defaultProps} />);
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
  });


  test("calls handleCancel when Cancel clicked", () => {
    render(<ProxyModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("cancel-btn"));
    expect(defaultProps.setIsModalOpen).toHaveBeenCalledWith(false);
  });


  test("shows success text when proxyVerified = 1", () => {
    render(<ProxyModal {...defaultProps} />);
    expect(screen.getByText(/implementation contract is found/i)).toBeInTheDocument();
  });


  test("clicking Save calls saveProxy and closes modal on success", async () => {
    saveProxy.mockResolvedValue(true);

    render(<ProxyModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId("ok-btn"));

    await waitFor(() => expect(saveProxy).toHaveBeenCalledWith("0xHASH"));
    expect(toast.success).toHaveBeenCalledWith("Successfully Saved");
    expect(defaultProps.setIsModalOpen).toHaveBeenCalledWith(false);
  });


  test("proxyVerified = 0 shows warning UI", () => {
    render(
      <ProxyModal
        {...defaultProps}
        proxyVerified={0}
      />
    );

    expect(screen.getByText(/does not seem to be verified/i)).toBeInTheDocument();
  });


  test("proxyVerified = 0 and no implementation address", () => {
    render(
      <ProxyModal
        {...defaultProps}
        implementationAddress={CONTARCT_NULL_ADDRESS}
        proxyVerified={0}
      />
    );

    expect(screen.getByText(/You have no implementation address/i)).toBeInTheDocument();
  });


  test("Save button text hides when proxyVerified = 0", () => {
    render(
      <ProxyModal
        {...defaultProps}
        proxyVerified={0}
      />
    );
    expect(screen.getByTestId("ok-btn").textContent).toBe("OK");
  });
});
