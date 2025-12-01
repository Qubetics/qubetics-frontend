import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EventLogs from "../eventLogs";
import "@testing-library/jest-dom";

describe("EventLogs Component", () => {
    const mockLogs = [
        {
            events: [
                {
                    type: "transfer",
                    attributes: [
                        { key: "sender", value: "addr1" },
                        { key: "recipient", value: "addr2" },
                    ],
                },
                {
                    type: "message",
                    attributes: [{ key: "action", value: "send" }],
                },
            ],
        },
    ];

    test("renders without crashing", () => {
        render(<EventLogs logs={mockLogs} />);
        // Component renders collapse panels
        expect(screen.getByText("#transfer")).toBeInTheDocument();
    });

    test("renders collapse labels", () => {
        render(<EventLogs logs={mockLogs} />);

        expect(screen.getByText("#transfer")).toBeInTheDocument();
        expect(screen.getByText("#message")).toBeInTheDocument();
    });

    test("renders event attributes when expanded", () => {
        render(<EventLogs logs={mockLogs} />);

        // Expand the first collapse panel
        const transferHeader = screen.getByText("#transfer");
        fireEvent.click(transferHeader);

        // Now attributes should be visible
        expect(screen.getByText("sender:")).toBeInTheDocument();
        expect(screen.getByText("addr1")).toBeInTheDocument();
        expect(screen.getByText("recipient:")).toBeInTheDocument();
        expect(screen.getByText("addr2")).toBeInTheDocument();
    });

    test("collapse expand works (onChange)", () => {
        console.log = jest.fn();
        render(<EventLogs logs={mockLogs} />);

        const header = screen.getByText("#transfer");
        fireEvent.click(header);

        expect(console.log).toHaveBeenCalled();
    });

    test("handles empty logs safely", () => {
        const { container } = render(<EventLogs logs={[{ events: [] }]} />);
        // should not crash - just check it renders
        expect(container.querySelector('.customCollapse')).toBeInTheDocument();
    });
});
