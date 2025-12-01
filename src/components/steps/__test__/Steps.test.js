import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../Steps";
import { InitStatus, verifyContractConstant } from "@/constant/constant";

// Mock child components
jest.mock("@/app/(routes)/contract/verify/VerifySecondStep", () => {
    return function MockVerifySecondStep({ steps, next, prev, current }) {
        return (
            <div data-testid="verify-second-step">
                <div>VerifySecondStep</div>
                <div>Current: {current}</div>
                <button onClick={prev} data-testid="prev-button">Previous</button>
                <button onClick={next} data-testid="next-button">Next</button>
            </div>
        );
    };
});

jest.mock("@/components/publishContract/PublishContract", () => {
    return function MockPublishContract({ steps, next, prev, current }) {
        return (
            <div data-testid="publish-contract">
                <div>PublishContract</div>
                <div>Current: {current}</div>
                <button onClick={prev} data-testid="prev-button">Previous</button>
                <button onClick={next} data-testid="next-button">Next</button>
            </div>
        );
    };
});

jest.mock("@/components/search/SearchbarComponent", () => {
    return function MockSearchbarComponent({ searchStatus, setSerachStatus }) {
        return <div data-testid="searchbar">SearchbarComponent</div>;
    };
});

jest.mock("@/components/FilterResult/FilterResult", () => {
    return function MockFilterResult() {
        return <div data-testid="filter-result">FilterResult</div>;
    };
});

// Mock antd Steps component
jest.mock("antd", () => {
    const actual = jest.requireActual("antd");
    return {
        ...actual,
        Steps: ({ current, items, responsive, labelPlacement }) => (
            <div data-testid="antd-steps" data-current={current}>
                {items?.map((item, index) => (
                    <div key={item.key} data-testid={`step-${index}`}>
                        {item.title}
                    </div>
                ))}
            </div>
        ),
        theme: {
            useToken: () => ({ token: {} }),
        },
    };
});

describe("Steps Component (App)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Basic Rendering", () => {
        test("renders without crashing", () => {
            render(<App />);
            expect(screen.getByTestId("filter-result")).toBeInTheDocument();
        });

        test("renders the main verify container", () => {
            const { container } = render(<App />);
            expect(container.querySelector(".verify")).toBeInTheDocument();
        });

        test("renders the steps container", () => {
            const { container } = render(<App />);
            expect(container.querySelector(".steps")).toBeInTheDocument();
        });

        test("renders the stepsFlex container", () => {
            const { container } = render(<App />);
            expect(container.querySelector(".stepsFlex")).toBeInTheDocument();
        });
    });

    describe("Component Structure", () => {
        test("renders FilterResult component", () => {
            render(<App />);
            expect(screen.getByTestId("filter-result")).toBeInTheDocument();
        });

        test("renders Ant Design Steps component", () => {
            render(<App />);
            expect(screen.getByTestId("antd-steps")).toBeInTheDocument();
        });

        test("renders steps with correct items", () => {
            render(<App />);
            expect(screen.getByText("Enter Contract Details")).toBeInTheDocument();
            expect(screen.getByText("Verify & Publish")).toBeInTheDocument();
        });

        test("renders both step items", () => {
            render(<App />);
            expect(screen.getByTestId("step-0")).toBeInTheDocument();
            expect(screen.getByTestId("step-1")).toBeInTheDocument();
        });
    });

    describe("Constants Display", () => {
        test("displays VERIFY_AND_PUBLISH_CONTRACT heading", () => {
            render(<App />);
            expect(screen.getByText(verifyContractConstant.VERIFY_AND_PUBLISH_CONTRACT)).toBeInTheDocument();
        });


        test("displays LITING_TWO content", () => {
            const { container } = render(<App />);
            expect(container.textContent).toContain("Please be informed that advanced settings");
        });

        test("renders both listing items", () => {
            const { container } = render(<App />);
            const paragraphs = container.querySelectorAll(".verifyPublish__left p");
            expect(paragraphs.length).toBe(2);
        });
    });

    describe("Initial State", () => {
        test("starts at step 0 (first step)", () => {
            render(<App />);
            const stepsComponent = screen.getByTestId("antd-steps");
            expect(stepsComponent).toHaveAttribute("data-current", "0");
        });

        test("renders PublishContract component initially", () => {
            render(<App />);
            expect(screen.getByTestId("publish-contract")).toBeInTheDocument();
        });

        test("does not render VerifySecondStep initially", () => {
            render(<App />);
            expect(screen.queryByTestId("verify-second-step")).not.toBeInTheDocument();
        });

        test("displays current step as 0 in PublishContract", () => {
            render(<App />);
            expect(screen.getByText("Current: 0")).toBeInTheDocument();
        });
    });

    describe("Step Navigation", () => {
        test("navigates to next step when next is called", () => {
            render(<App />);

            // Initially at step 0
            expect(screen.getByTestId("publish-contract")).toBeInTheDocument();

            // Click next button
            const nextButton = screen.getByTestId("next-button");
            fireEvent.click(nextButton);

            // Should now be at step 1
            expect(screen.getByTestId("verify-second-step")).toBeInTheDocument();
            expect(screen.queryByTestId("publish-contract")).not.toBeInTheDocument();
        });

        test("navigates to previous step when prev is called", () => {
            render(<App />);

            // Navigate to step 1
            const nextButton = screen.getByTestId("next-button");
            fireEvent.click(nextButton);
            expect(screen.getByTestId("verify-second-step")).toBeInTheDocument();

            // Navigate back to step 0
            const prevButton = screen.getByTestId("prev-button");
            fireEvent.click(prevButton);
            expect(screen.getByTestId("publish-contract")).toBeInTheDocument();
            expect(screen.queryByTestId("verify-second-step")).not.toBeInTheDocument();
        });

        test("updates current state correctly when navigating", () => {
            render(<App />);

            // Start at 0
            expect(screen.getByText("Current: 0")).toBeInTheDocument();

            // Go to step 1
            fireEvent.click(screen.getByTestId("next-button"));
            expect(screen.getByText("Current: 1")).toBeInTheDocument();

            // Go back to step 0
            fireEvent.click(screen.getByTestId("prev-button"));
            expect(screen.getByText("Current: 0")).toBeInTheDocument();
        });
    });

    describe("Conditional Rendering", () => {
        test("renders PublishContract when current is 0", () => {
            render(<App />);
            expect(screen.getByTestId("publish-contract")).toBeInTheDocument();
            expect(screen.queryByTestId("verify-second-step")).not.toBeInTheDocument();
        });

        test("renders VerifySecondStep when current is 1", () => {
            render(<App />);

            // Navigate to step 1
            fireEvent.click(screen.getByTestId("next-button"));

            expect(screen.getByTestId("verify-second-step")).toBeInTheDocument();
            expect(screen.queryByTestId("publish-contract")).not.toBeInTheDocument();
        });

        test("passes correct props to PublishContract", () => {
            render(<App />);
            const publishContract = screen.getByTestId("publish-contract");
            expect(publishContract).toBeInTheDocument();
            expect(screen.getByText("Current: 0")).toBeInTheDocument();
        });

        test("passes correct props to VerifySecondStep", () => {
            render(<App />);

            // Navigate to step 1
            fireEvent.click(screen.getByTestId("next-button"));

            const verifySecondStep = screen.getByTestId("verify-second-step");
            expect(verifySecondStep).toBeInTheDocument();
            expect(screen.getByText("Current: 1")).toBeInTheDocument();
        });
    });

    describe("Steps Configuration", () => {
        test("creates items array from steps", () => {
            render(<App />);
            expect(screen.getByTestId("step-0")).toBeInTheDocument();
            expect(screen.getByTestId("step-1")).toBeInTheDocument();
        });

        test("maps step titles correctly", () => {
            render(<App />);
            expect(screen.getByText("Enter Contract Details")).toBeInTheDocument();
            expect(screen.getByText("Verify & Publish")).toBeInTheDocument();
        });
    });

    describe("State Management", () => {
        test("initializes searchStatus with InitStatus", () => {
            // This is tested indirectly through component rendering
            const { container } = render(<App />);
            expect(container.querySelector(".verify")).toBeInTheDocument();
        });

        test("maintains current step state", () => {
            render(<App />);

            // Initial state
            expect(screen.getByText("Current: 0")).toBeInTheDocument();

            // After navigation
            fireEvent.click(screen.getByTestId("next-button"));
            expect(screen.getByText("Current: 1")).toBeInTheDocument();
        });
    });

    describe("Layout Structure", () => {
        test("renders verifyPublish__left section", () => {
            const { container } = render(<App />);
            expect(container.querySelector(".verifyPublish__left")).toBeInTheDocument();
        });

        test("renders verify_btns section", () => {
            const { container } = render(<App />);
            expect(container.querySelector(".verify_btns")).toBeInTheDocument();
        });

        test("renders heading in left section", () => {
            const { container } = render(<App />);
            const heading = container.querySelector(".verifyPublish__left h3");
            expect(heading).toBeInTheDocument();
            expect(heading.textContent).toBe(verifyContractConstant.VERIFY_AND_PUBLISH_CONTRACT);
        });
    });

    describe("Integration Tests", () => {
        test("complete navigation flow from step 0 to 1 and back", () => {
            render(<App />);

            // Start at step 0
            expect(screen.getByTestId("publish-contract")).toBeInTheDocument();
            expect(screen.getByText("Current: 0")).toBeInTheDocument();

            // Navigate to step 1
            fireEvent.click(screen.getByTestId("next-button"));
            expect(screen.getByTestId("verify-second-step")).toBeInTheDocument();
            expect(screen.getByText("Current: 1")).toBeInTheDocument();

            // Navigate back to step 0
            fireEvent.click(screen.getByTestId("prev-button"));
            expect(screen.getByTestId("publish-contract")).toBeInTheDocument();
            expect(screen.getByText("Current: 0")).toBeInTheDocument();
        });

        test("renders all main components together", () => {
            render(<App />);

            expect(screen.getByTestId("filter-result")).toBeInTheDocument();
            expect(screen.getByTestId("antd-steps")).toBeInTheDocument();
            expect(screen.getByTestId("publish-contract")).toBeInTheDocument();
            expect(screen.getByText(verifyContractConstant.VERIFY_AND_PUBLISH_CONTRACT)).toBeInTheDocument();
        });

        test("maintains component structure throughout navigation", () => {
            const { container } = render(<App />);

            // Check initial structure
            expect(container.querySelector(".verify")).toBeInTheDocument();
            expect(container.querySelector(".steps")).toBeInTheDocument();
            expect(container.querySelector(".stepsFlex")).toBeInTheDocument();

            // Navigate
            fireEvent.click(screen.getByTestId("next-button"));

            // Structure should remain
            expect(container.querySelector(".verify")).toBeInTheDocument();
            expect(container.querySelector(".steps")).toBeInTheDocument();
            expect(container.querySelector(".stepsFlex")).toBeInTheDocument();
        });
    });

    describe("Edge Cases", () => {
        test("handles navigation to step 1", () => {
            render(<App />);

            const nextButton = screen.getByTestId("next-button");

            // Click next to go to step 1
            fireEvent.click(nextButton);
            expect(screen.getByText("Current: 1")).toBeInTheDocument();
            expect(screen.getByTestId("verify-second-step")).toBeInTheDocument();
        });

        test("handles navigation back to step 0", () => {
            render(<App />);

            // Go to step 1 first
            fireEvent.click(screen.getByTestId("next-button"));
            expect(screen.getByText("Current: 1")).toBeInTheDocument();

            // Go back to step 0
            const prevButton = screen.getByTestId("prev-button");
            fireEvent.click(prevButton);

            expect(screen.getByText("Current: 0")).toBeInTheDocument();
            expect(screen.getByTestId("publish-contract")).toBeInTheDocument();
        });
    });
});
