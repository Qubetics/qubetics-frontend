import React from "react";
import { render, screen } from "@testing-library/react";
import AnalyticHistoric from "./AnalyticHistoric.jsx";
import HistoryPriceGraph from "../AnalyticGraph/HistoryPriceGraph";

jest.mock("../AnalyticGraph/HistoryPriceGraph", () => () => <div data-testid="history-graph">Graph</div>);

describe("AnalyticHistoric Component", () => {
  test("renders HistoryPriceGraph component", () => {
    render(<AnalyticHistoric />);
    
    const graphElement = screen.getByTestId("history-graph");
    expect(graphElement).toBeInTheDocument();
  });
});
