// ContractVerificationProvider.test.jsx
import React from "react";
import { render, screen, act } from "@testing-library/react";
import {
  ContractVerificationProvider,
  useContractData,
} from ".././contractContext";
import "@testing-library/jest-dom";

// A simple test component that consumes the context
const TestComponent = () => {
  const {
    runsOptimizer,
    setRunsOptimizer,
    contractAddress,
    setContractAddress,
  } = useContractData();

  return (
    <div>
      <p data-testid="optimizer">{runsOptimizer}</p>
      <p data-testid="address">{contractAddress}</p>

      <button onClick={() => setRunsOptimizer(500)}>Set Optimizer</button>
      <button onClick={() => setContractAddress("0x123")}>Set Address</button>
    </div>
  );
};

describe("ContractVerificationProvider", () => {
  test("renders children correctly", () => {
    render(
      <ContractVerificationProvider>
        <div data-testid="child">Hello</div>
      </ContractVerificationProvider>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  test("provides default context values", () => {
    render(
      <ContractVerificationProvider>
        <TestComponent />
      </ContractVerificationProvider>
    );

    expect(screen.getByTestId("optimizer").textContent).toBe("200");
    expect(screen.getByTestId("address").textContent).toBe("");
  });

  test("updates context values using setters", () => {
    render(
      <ContractVerificationProvider>
        <TestComponent />
      </ContractVerificationProvider>
    );

    // click to update values
    act(() => {
      screen.getByText("Set Optimizer").click();
    });
    act(() => {
      screen.getByText("Set Address").click();
    });

    expect(screen.getByTestId("optimizer").textContent).toBe("500");
    expect(screen.getByTestId("address").textContent).toBe("0x123");
  });
});
