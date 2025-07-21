import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const CircleComponent = () => {
  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
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
      borderRadius: 5,
      borderWidth: 1,
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
      pie: {
        innerSize: "60%",
        dataLabels: { enabled: false },
        borderWidth: 0,
      },
      color: {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, "#FF00FF"],
          [1, "#8000FF"],
        ],
      },
    },
    series: [
      {
        name: "Revenue",
        data: [45, 60, 35, 70, 55, 80],
        color: "#9f53ff",
      },
      // {
      //   name: "lose",
      //   data: [15, 22, 88, 33, 7, 63],
      //   color: "#9f53ff",
      // },
    ],
    accessibility: {
      enabled: false,
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { height: "210px",width:"210px" } }}
    />
  );
};

export default CircleComponent;
