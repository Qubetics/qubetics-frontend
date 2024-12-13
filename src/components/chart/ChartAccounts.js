import { chartMenu, chartSeriesValue } from "@/utils/chartMenu";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import "./chart.scss";
import { generateData } from "@/constant/constant";

const ChartAccount = ({ data, chartType, name }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    let chartValue = chartMenu(data, chartType);

    let maxLength =
      data?.length > 0 ? data?.length : generateData(chartType).length;

    let { seriesData, maximum } = chartSeriesValue(data, chartType);
    console.log("seriesData", seriesData);
    const options = {
      chart: {
        type: "area",
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
        type: "linear",
        title: {
          text: chartType,
        },
        min: 0,
        max: maxLength - 1,
        scrollbar: {
          enabled: true,
        },
        tickLength: 0,
        categories: [...chartValue],
      },
      yAxis: {
        min: 0,
        max: maximum?.count < 4 ? 4 : maximum?.count,
        title: {
          text: "",
        },
        gridLineWidth: 0,
        gridLineColor: "#bec4d2",
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
              [0, "rgba(159, 83, 255, 0.2)"], // Light color at the top
              [1, "rgba(7, 14, 31, 0)"], // Transparent at the bottom
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
        line: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        {
          name: name,
          data: seriesData && [...seriesData],
          color: "rgba(126, 66, 202, 0.5)", // Color of the line
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

export default React.memo(ChartAccount);
