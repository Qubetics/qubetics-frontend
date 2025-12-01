import React from "react";
import { render, screen } from "@testing-library/react";
import HistoryPriceGraph from "../HistoryPriceGraph";

jest.mock("highcharts/highstock", () => ({
  __esModule: true,
  default: {},
}));

jest.mock("highcharts-react-official", () => {
  return function MockedHighchartsReact(props) {
    return (
      <div data-testid="highcharts-react">
        Highcharts Mock - {JSON.stringify(props.options)}
      </div>
    );
  };
});

jest.mock("@/constant/constant", () => ({
  currencyName: "USDT",
}));

describe("HistoryPriceGraph Component", () => {
  test("renders HighchartsReact successfully", () => {
    render(<HistoryPriceGraph />);

    const chartComponent = screen.getByTestId("highcharts-react");

    expect(chartComponent).toBeInTheDocument();
  });

  test("passes correct title to yAxis", () => {
    render(<HistoryPriceGraph />);

    const chartComponent = screen.getByTestId("highcharts-react");

    expect(chartComponent.textContent).toContain(
      "Tether USDT Daily Price(USD)"
    );
  });

  test("contains two series (Tether Price & ICO Price)", () => {
    render(<HistoryPriceGraph />);

    const chartComponent = screen.getByTestId("highcharts-react");

    expect(chartComponent.textContent).toContain("Tether USDT Daily Price");
    expect(chartComponent.textContent).toContain("ICO Price");
  });
});
