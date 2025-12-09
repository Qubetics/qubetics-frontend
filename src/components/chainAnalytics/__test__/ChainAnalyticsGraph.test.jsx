import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import ChainAnalyticsGraph from "./../ChainAnalyticsGraph";
import getGraphData from "@/services/getGraphData";
import { useLatestData } from "@/components/contexts/latest_data";
import { useGetNetwork } from "@/components/contexts/networkChanged";

// Mock services and components
jest.mock("@/services/getGraphData");
jest.mock("@/components/contexts/latest_data");
jest.mock("@/components/contexts/networkChanged");
jest.mock("@/components/chart/ChartAccounts", () =>
  jest.fn(() => <div data-testid="chart-component" />)
);
jest.mock("@/components/loader/GraphLoading", () =>
  jest.fn(() => <div data-testid="loading-spinner" />)
);
jest.mock("@/app/(routes)/notfound/page", () =>
  jest.fn(() => <div data-testid="error-page" />)
);
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Select: ({ onChange, value, options, ...props }) => (
    <select {...props} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
  Space: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

describe("ChainAnalyticsGraph Component", () => {
  const props = {
    title: "Test Chart",
    discription: "Test Description",
    fetchUrl: "/test-url",
    tooltipTitle: "Txn Count",
    graphdashboard: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useLatestData.mockReturnValue([]);
    useGetNetwork.mockReturnValue({ isNetworkChanged: false });
  });

  test("renders loading initially", async () => {
    getGraphData.mockReturnValue(new Promise(() => {})); // never resolves
    render(<ChainAnalyticsGraph {...props} />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  test("renders ChartAccounts on successful fetch", async () => {
    getGraphData.mockResolvedValue({
      data: {
        finalData: [{ value: 10, count: 5 }],
      },
    });
    await act(async () => {
      render(<ChainAnalyticsGraph {...props} />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("chart-component")).toBeInTheDocument();
    });
  });

  test("renders Page component on error", async () => {
    getGraphData.mockRejectedValue(new Error("API Error"));
    await act(async () => {
      render(<ChainAnalyticsGraph {...props} />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("error-page")).toBeInTheDocument();
    });
  });

  test("calls handleTransactionHistory when dropdown changes", async () => {
    getGraphData.mockResolvedValue({
      data: { finalData: [{ value: 1, count: 1 }] },
    });
    await act(async () => {
      render(<ChainAnalyticsGraph {...props} />);
    });
    const dropdown = screen.getByRole("combobox");
    await act(async () => {
      fireEvent.change(dropdown, { target: { value: "30 Days" } });
    });
    await waitFor(() => {
      expect(getGraphData).toHaveBeenCalledTimes(2); // initial + change
    });
  });

  test("renders title and description correctly", () => {
    render(<ChainAnalyticsGraph {...props} />);
    expect(screen.getByText("Test Chart")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });
});
