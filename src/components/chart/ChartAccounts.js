import { currencyName, generateData, noExponential } from "@/constant/constant";
import { chartMenu, chartSeriesValue } from "@/utils/chartMenu";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import "./chart.scss";

const ChartAccount = ({ data, chartType, name, title }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    let chartValue = chartMenu(data, chartType);
    let maxLength = data?.length > 0 ? data?.length : generateData(chartType).length;
    let { seriesData, maximum } = chartSeriesValue(data, chartType);

    const numericSeriesData = seriesData.map((v) => (typeof v === "number" ? v : new BigNumber(v)?.toNumber()));

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
        useHTML: true,
        formatter: function () {
          const xAxisData = this.series.xAxis.categories[this.x];
          return `
            <div style="white-space: normal; font-size: 15px; text-align: center; padding: 0 28px 12px; min-height:50px; min-width: 160px; display:flex; align-items: center;">
              ${xAxisData}<br>
              ${name === "Uptime" ? currencyName : name}: ${noExponential(this.y)}
            </div>`;
        },
        positioner: function (labelWidth, labelHeight, point) {
          const chart = this.chart;
          const tooltipX = point.plotX + chart.plotLeft - labelWidth / 2;
          const tooltipY = point.plotY + chart.plotTop - labelHeight - 10;
          const x = Math.max(Math.min(tooltipX, chart.chartWidth - labelWidth - 10), 10);
          const y = Math.max(tooltipY, 10);
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
        min: 0,
        max: maximum?.count > 0.000001 ? maximum?.count : 1,
        tickInterval: maximum?.count > 0.000001 ? undefined : 0.25,
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
          data: numericSeriesData,
          color: "rgba(126, 66, 202, 0.7)",
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
      <div className='chart-wrapper' style={{ height: "100%" }}>
        {chartData !== null ? (
          <HighchartsReact highcharts={Highcharts} options={chartData} containerProps={{ style: { height: "100%" } }} />
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(ChartAccount);
