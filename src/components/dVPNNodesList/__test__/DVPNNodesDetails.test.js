/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DVPNNodesDetails from "../DVPNNodesDetails";
import getNodeDetails from "@/services/getNodeDetails";

jest.mock("@/services/getNodeDetails");

// Mock CopyText
jest.mock("../../DoCopy/CopyText", () => () => (
    <span data-testid="copy-btn">Copy</span>
));

// Mock SVG
jest.mock("../../../../public/SvgIcons", () => ({
    Datnotfound: () => <div>No data icon</div>,
}));

// Mock Pagination
jest.mock("../../Pagination/Pagination", () => (props) => (
    <div>
        <button onClick={props.handlePrevious}>Prev</button>
        <button onClick={props.handleNext}>Next</button>
    </div>
));

// Mock SkeletonTableWrapper
jest.mock("../../SkeletonTableWrapper/SkeletonTableWrapper", () => ({
    SkeletonTableWrapper: ({ dataSource, columns, locale }) => (
        <div data-testid="skeleton-wrapper">
            {dataSource && dataSource.length > 0 ? (
                <table>
                    <tbody>
                        {dataSource.map((row, i) => (
                            <tr key={i}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.render
                                            ? col.render(row[col.dataIndex], row)
                                            : row[col.dataIndex]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div data-testid="empty-state">{locale.emptyText}</div>
            )}
        </div>
    ),
}));

describe("DVPNNodesDetails Component", () => {
    const mockResponse = {
        data: {
            total_count: 15,
            result: [
                {
                    txhash: "abcd1234",
                    blocknumber: 100,
                    type: "SEND",
                    value: "20",
                    txFee: "0.002",
                    timestamp: Date.now(),
                    status: "SUCCESS",
                },
            ],
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("shows skeleton initially", async () => {
        getNodeDetails.mockResolvedValueOnce(mockResponse);

        render(<DVPNNodesDetails nodeName="testNode" />);

        expect(screen.getByTestId("skeleton-wrapper")).toBeInTheDocument();
    });

    test("renders table after API success", async () => {
        getNodeDetails.mockResolvedValueOnce(mockResponse);

        render(<DVPNNodesDetails nodeName="testNode" />);

        await waitFor(() => {
            expect(screen.getByText(/abcd123/)).toBeInTheDocument();
            expect(screen.getByText("100")).toBeInTheDocument();
            expect(screen.getAllByTestId("copy-btn").length).toBeGreaterThan(0);
        });
    });

    test("shows No Data UI when result is empty", async () => {
        getNodeDetails.mockResolvedValueOnce({
            data: { total_count: 0, result: [] },
        });

        render(<DVPNNodesDetails nodeName="testNode" />);

        await waitFor(() => {
            expect(screen.getByText("No data")).toBeInTheDocument();
        });
    });

    test("pagination next button works", async () => {
        getNodeDetails.mockResolvedValue(mockResponse);

        render(<DVPNNodesDetails nodeName="testNode" />);

        await waitFor(() => screen.getByText(/abcd123/));

        const nextBtn = screen.getByText("Next");
        fireEvent.click(nextBtn);

        await waitFor(() => {
            expect(getNodeDetails).toHaveBeenCalledWith("testNode", 2, 10);
        });
    });

    test("error state should show No Data", async () => {
        getNodeDetails.mockRejectedValueOnce(new Error("API Error"));

        render(<DVPNNodesDetails nodeName="testNode" />);

        await waitFor(() => {
            expect(screen.getByText("No data")).toBeInTheDocument();
        });
    });
});
