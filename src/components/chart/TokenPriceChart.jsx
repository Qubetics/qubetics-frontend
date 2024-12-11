import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./chart.scss";
import {
  ALL_CHART_SEVEN_DAY,
  ALL_CHART_THRITY_DAYS,
} from "@/constant/graphTableValues";

const TokenPriceChart = ({ data, chartType }) => {
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    let seriesData = [];
    const dates = data.map((e) => Object.keys(e)[0]);

    seriesData = data
      ?.flatMap((dayData) => Object.values(dayData))
      ?.flat()
      ?.map((entry) => ({
        x: new Date(entry?.createdAt).getTime(),
        y: parseFloat(entry?.price),
      }));

    const options = {
      chart: {
        type: "area", // Change to 'area' to enable filled area
        spacingBottom: 15,
        backgroundColor: "#152A59",
      },
      title: {
        text: " ",
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        backgroundColor: "#1a272e",
        borderColor: "black",
        borderRadius: 10,
        borderWidth: 3,
        xDateFormat: "%A, %b %e, %Y %H:%M:%S",
        shared: true,
        valueDecimals: 5,
      },
      legend: {
        enabled: false,
        itemStyle: {
          color: "white",
        },
        itemHoverStyle: {
          color: "white",
        },
      },
      xAxis: {
        type: "datetime",
        scrollbar: {
          enabled: true,
        },
        tickLength: 0,
        gridLineWidth: 0, // Remove background grid lines
        dateTimeLabelFormats: {
          day: "%e %b", // Format for days (e.g., "12 Aug")
          month: "%b %Y", // Format for months (e.g., "Aug 2024")
          year: "%Y" // Format for years (e.g., "2024")
        },
      },
      yAxis: {
        title: {
          text: "",
        },
        gridLineWidth: 0, // Remove background grid lines
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, "rgba(68, 170, 213, 0.2)"], // Light color at the top
              [1, "rgba(68, 170, 213, 0)"], // Transparent at the bottom
            ],
          },
          marker: {
            radius: 2,
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
      },
      series: [
        {
          name: "Price",
          data: seriesData && [...seriesData],
          color: "rgba(68, 170, 213, 1)", // Color of the line
        },
      ],
      accessibility: {
        enabled: false,
      },
    };
    setChartData(options);
  }, [data, chartType]);

  return (
    <div>
      <div className="chart-wrapper" style={{ height: "100%" }}>
        {chartData !== null ? (
          <HighchartsReact
            highcharts={Highcharts}
            options={chartData}
            containerProps={{ style: { height: "100%" } }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(TokenPriceChart);
