import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CodeTabContent from "../CodeTabContent";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";

jest.mock("@/services/getContractVeriicationDetail", () =>
  jest.fn()
);
jest.mock("@/services/getProxyVerificationDetail", () =>
  jest.fn()
);

jest.mock("../../contractVerificationDetails/showErrorWarningMessage", () => ({
  errorWarning: jest.fn(() => "compiler-msg"),
}));

jest.mock("../../contexts/contractContext", () => ({
  useContractData: () => ({
    setVerifyAddress: jest.fn(),
  }),
}));

// Mock child components
jest.mock("../../contractVerificationDetails/VerificationStatus.js", () => () => (
  <div data-testid="VerificationStatus" />
));
jest.mock("../../contractVerificationDetails/CompilerMessage.js", () => () => (
  <div data-testid="CompilerMessage" />
));
jest.mock("../../contractVerificationDetails/ContractNameData.js", () => () => (
  <div data-testid="ContractNameData" />
));
jest.mock("../../contractVerificationDetails/SourceCode.js", () => () => (
  <div data-testid="SourceCode" />
));
jest.mock("../../contractVerificationDetails/ContractAbi.js", () => () => (
  <div data-testid="ContractAbi" />
));
jest.mock("../../contractVerificationDetails/ByteCreationCode.js", () => () => (
  <div data-testid="ByteCreationCode" />
));
jest.mock("../../ProxyModal/ProxyModal.js", () => () => (
  <div data-testid="ProxyModal" />
));
jest.mock("../../loader/Loader.js", () => () => <div data-testid="Loader" />);

import getContractVerificationDetail from "@/services/getContractVeriicationDetail";
import getProxyVerificationDetail from "@/services/getProxyVerificationDetail";
import { errorWarning } from "../../contractVerificationDetails/showErrorWarningMessage";

// Utility wrapper
const renderComponent = (hash = "0x123") => render(<CodeTabContent hash={hash} />);

describe("CodeTabContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows Loader initially", async () => {
    getContractVerificationDetail.mockResolvedValue({});
    getProxyVerificationDetail.mockResolvedValue({});

    renderComponent();

    expect(screen.getByTestId("Loader")).toBeInTheDocument();
  });

  test("loads data successfully & renders all child components", async () => {
    getContractVerificationDetail.mockResolvedValue({
      verificationType: 1,
    });
    getProxyVerificationDetail.mockResolvedValue({
      implementation: "0xproxy",
      verified: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId("VerificationStatus")).toBeInTheDocument();
    });

    expect(errorWarning).toHaveBeenCalled();

    // Check child components render
    expect(screen.getByTestId("ContractNameData")).toBeInTheDocument();
    expect(screen.getByTestId("CompilerMessage")).toBeInTheDocument();
    expect(screen.getByTestId("SourceCode")).toBeInTheDocument();
    expect(screen.getByTestId("ContractAbi")).toBeInTheDocument();
    expect(screen.getByTestId("ByteCreationCode")).toBeInTheDocument();
  });

  test("shows proxy button when implementationAddress exists", async () => {
    getContractVerificationDetail.mockResolvedValue({
      verificationType: 2,
    });

    getProxyVerificationDetail.mockResolvedValue({
      implementation: "0x999",
      verified: true,
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("Is this a proxy?")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Is this a proxy?"));

    expect(screen.getByTestId("ProxyModal")).toBeInTheDocument();
  });

  test("handles verificationType = -1 (skip ContractNameData)", async () => {
    getContractVerificationDetail.mockResolvedValue({
      verificationType: -1,
    });

    getProxyVerificationDetail.mockResolvedValue({
      implementation: "",
    });

    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("CompilerMessage")).toBeInTheDocument()
    );

    // Should NOT show ContractNameData
    expect(screen.queryByTestId("ContractNameData")).not.toBeInTheDocument();
  });

  test("handles error state properly", async () => {
    getContractVerificationDetail.mockRejectedValue(new Error("err"));
    getProxyVerificationDetail.mockResolvedValue({});

    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("ByteCreationCode")).toBeInTheDocument()
    );
  });
});
