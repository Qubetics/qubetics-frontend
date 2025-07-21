import React from "react";

export default function BarChart() {
  const options = {
    chart: {
      type: "bar",
      spacingBottom: 15,
      backgroundColor: "#1D1D1D99",
    },
    title: {
      text: "",
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
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      title: {
        text: "Month",
        style: {
          color: "#ffffff",
        },
      },
      tickLength: 0,
      gridLineWidth: 0,
      labels: {
        style: {
          color: "#ffffff",
        },
      },
    },
    yAxis: {
      min: 0,
      max: 100,
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
        fillOpacity: 1,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(144, 102, 227, 0.4)"], // more solid top
            [1, "rgba(144, 102, 227, 0.05)"], // faded bottom
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
        name: "Revenue",
        data: [45, 60, 35, 70, 55, 80],
        color: "#9066E3",
      },
      {
        name: "lose",
        data: [15, 22, 88, 33, 7, 63],
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
      containerProps={{ style: { height: "100%" } }}
    />
  );
}
