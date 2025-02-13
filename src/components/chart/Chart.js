import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "./chart.scss";
import { chartMenu, chartSeriesValue } from "@/utils/chartMenu";

const Chart = ({ data, chartType }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    let chartValue = chartMenu(data, chartType) ?? [];
    let maxLength = data && data?.length;
    const { seriesData, maximum } = chartSeriesValue(data);
    const validSeriesData = Array.isArray(seriesData) ? seriesData : [];
    Highcharts.setOptions({
      lang: {
        thousandsSep: "", // Remove space separator
      },
    });
    const options = {
      chart: {
        type: "line",
        spacingBottom: 15,
        backgroundColor: {
          color: "#152A59",
        },
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
        gridLineColor: "#55585f",
      },

      series: [
        {
          name: "Transactions",
          data: [...validSeriesData],
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
          <HighchartsReact highcharts={Highcharts} options={chartData} />
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(Chart);
