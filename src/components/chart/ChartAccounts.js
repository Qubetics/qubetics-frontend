import { currencyName, generateData } from "@/constant/constant";
import { chartMenu, chartSeriesValue } from "@/utils/chartMenu";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import "./chart.scss";

const ChartAccount = ({ data, chartType, name, title }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    let chartValue = chartMenu(data, chartType);

    let maxLength =
      data?.length > 0 ? data?.length : generateData(chartType).length;

    let { seriesData, maximum } = chartSeriesValue(data, chartType);
    const options = {
      chart: {
        type: "area",
        spacingBottom: 15,
        backgroundColor: "#152A59",
      },
      title: {
        text: "",
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        hideDelay: 0,
        useHTML: true, // Enable HTML for custom styling
        formatter: function () {
          const xAxisData = this.series.xAxis.categories[this.x];

          return `
            <div style="  white-space: normal; 
        font-size: 15px;
        text-align: center;
        padding: 0 28px 12px;
        min-height:50px;
        min-width: 160px;
        display:flex;
        align-items: center;">
        ${xAxisData}<br>
        ${name === "Uptime" ? currencyName : name}: ${this.y} 
        </div>`;
        },
        positioner: function (labelWidth, labelHeight, point) {
          const chart = this.chart;
          const tooltipX = point.plotX + chart.plotLeft - labelWidth / 2;
          const tooltipY = point.plotY + chart.plotTop - labelHeight - 10;

          // Adjust for edges
          const x = Math.max(
            Math.min(tooltipX, chart.chartWidth - labelWidth - 10),
            10
          );
          const y = Math.max(tooltipY, 10); // Avoid overlapping the top of the chart
          return { x, y };
        },
        backgroundColor: "#19181a",
        borderColor: "rgba(126, 66, 202, 0.7)",
        borderRadius: 10,
        borderWidth: 2,
        style: {
          color: "#fff",
          // Maintain text color
        },
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
          text: "",
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
        min: title === "Qubetics Price" ? Math.min(0, maximum?.count) : 0,
        // max: maximum?.count < 4 ? 4 : maximum?.count,
        max:
          title === "Qubetics Price" && maximum?.count < 0
            // ? 0
            // : maximum?.count < 4
            //   ? 4
            //   : maximum?.count,
            ? Math.min(0, maximum?.count) + 4
            : Math.min(0, maximum?.count) + maximum?.count,
        title: {
          text: "", 
        },
        gridLineWidth: 0,
        gridLineColor: "#9F53FF",
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0.5,
              y2: 1,
            },
            stops: [
              [0, "rgba(139, 93, 355, 0.5)"], // Light color at the top
              [1, "rgba(7, 14, 31, 0)"], // Transparent at the bottom
            ],
          },

          marker: {
            radius: 3,
          },
          lineWidth: 2.5,
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
          color: "rgba(126, 66, 202, 0.7)", // Color of the line
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
