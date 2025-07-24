// ChartComponent.jsx
"use client"

import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const ChartComponent = ({ chartType  = "column", categories = [], seriesData = [], title = "" }) => {
  const options = {
    chart: {
      type: chartType,
      spacingBottom: 15,
      backgroundColor: "transparent",
    },
    title: {
      text: title,
      style: {
        color: "#ffffff",
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      backgroundColor: "#1a272e",
      borderColor: "black",
      borderRadius: 10,
      borderWidth: 3,
      style: {
        color: "#fff",
      },
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: "white",
      },
      itemHoverStyle: {
        color: "lightgray",
      },
    },
    xAxis: {
      categories: categories,
      title: {
        text: "Date",
        style: {
          color: "#ffffff",
        },
      },
      // tickLength: 0,
      // gridLineWidth: 0,
      labels: {
        style: {
          color: "#ffffff",
        },
      },
    },
    yAxis: {
      min: 0,
      // max: 100,
      
      title: {
        text: "Value",
        style: {
          color: "#ffffff",
        },
      },
      gridLineColor: "#444",
      labels: {
        style: {
          color: "#ffffff",
        },
      },
    },
    plotOptions: {
      areaspline: {
        fillOpacity: 0,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(159, 83, 255, 0.4)"],
            [1, "rgba(7, 14, 31, 0)"],
          ],
        },
        marker: {
          radius: 3,
          fillColor: "#9f53ff",
        },
        lineWidth: 2,
        states: {
          hover: {
            lineWidth: 2,
          },
        },
        threshold: null,
      },
    },
    series: [
      {
        name: "Value",
        data: seriesData,
        color: "#9f53ff",
      },
    ],
    accessibility: {
      enabled: false,
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { height: "300px" } }}
    />
  );
};

export default ChartComponent;
