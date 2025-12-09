/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DVPNListView from "../DVPNListView";
import getNodeList from "@/services/getNodeList";
import { useRouter } from "next/navigation";

jest.mock("@/services/getNodeList");
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("../../DoCopy/CopyText", () => {
    return () => <div data-testid="copy-btn">Copy</div>;
});

// Mock next/image
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props) => <img {...props} alt={props.alt} />,
}));

// Mock Datnotfound SVG
jest.mock("../../../../public/SvgIcons", () => ({
    Datnotfound: () => <div>No data</div>,
}));

// Mock Pagination
jest.mock("../../Pagination/Pagination", () => (props) => (
    <div>
        <button onClick={props.handleNext}>Next</button>
        <button onClick={props.handlePrevious}>Prev</button>
    </div>
));

// Mock SkeletonTableWrapper
jest.mock("../../SkeletonTableWrapper/SkeletonTableWrapper", () => ({
    SkeletonTableWrapper: ({ dataSource, columns, locale, onRow }) => (
        <div data-testid="skeleton-wrapper">
            {dataSource && dataSource.length > 0 ? (
                <table>
                    <tbody>
                        {dataSource.map((row, i) => (
                            <tr key={i} onClick={() => onRow(row).onClick()}>
                                {columns.map((col) => (
                                    <td key={col.key}>
                                        {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
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

const mockPush = jest.fn();

describe("DVPNListView Component", () => {
    beforeEach(() => {
        useRouter.mockReturnValue({ push: mockPush });
        jest.clearAllMocks();
    });

    const mockNodeResponse = {
        data: {
            total: 15, // Increased to trigger pagination (> tableLimit of 10)
            nodes: [
                { address: "addr1", country: "USA", city: "California", status: "active" },
                { address: "addr2", country: "India", city: "Mumbai", status: "inactive" },
            ],
        },
    };

    test("renders skeleton initially", () => {
        getNodeList.mockResolvedValueOnce(mockNodeResponse);
        render(<DVPNListView />);

        const skeleton = screen.getByTestId("skeleton-wrapper");
        expect(skeleton).toBeInTheDocument();
    });

    test("renders table after API success", async () => {
        getNodeList.mockResolvedValueOnce(mockNodeResponse);

        render(<DVPNListView />);

        await waitFor(() => {
            expect(screen.getByText("addr1")).toBeInTheDocument();
            expect(screen.getByText("addr2")).toBeInTheDocument();
        });
    });

    test("shows No Data when nodes are empty", async () => {
        getNodeList.mockResolvedValueOnce({
            data: { total: 0, nodes: [] },
        });

        render(<DVPNListView />);

        await waitFor(() => {
            const noDataElements = screen.getAllByText("No data");
            expect(noDataElements.length).toBeGreaterThan(0);
        });
    });

    test("row click should navigate", async () => {
        getNodeList.mockResolvedValueOnce(mockNodeResponse);

        render(<DVPNListView />);

        const row = await screen.findByText("addr1");
        fireEvent.click(row);

        expect(mockPush).toHaveBeenCalledWith("/dVPNNodes/addr1?status=active");
    });

    test("copy button should NOT trigger navigation", async () => {
        getNodeList.mockResolvedValueOnce(mockNodeResponse);

        render(<DVPNListView />);

        const copyBtn = await screen.findAllByTestId("copy-btn");
        fireEvent.click(copyBtn[0]);

        expect(mockPush).not.toHaveBeenCalled();
    });

    test("pagination next button works", async () => {
        getNodeList.mockResolvedValue(mockNodeResponse);

        render(<DVPNListView />);

        await waitFor(() => screen.getByText("addr1"));

        const nextBtn = screen.getByText("Next");

        fireEvent.click(nextBtn);

        await waitFor(() => {
            expect(getNodeList).toHaveBeenCalledWith(2, 10, false);
        });
    });

    test("shows error state when API fails", async () => {
        getNodeList.mockRejectedValueOnce(new Error("API Error"));

        render(<DVPNListView />);

        await waitFor(() => {
            const noDataElements = screen.getAllByText("No data");
            expect(noDataElements.length).toBeGreaterThan(0);
        });
    });
});
