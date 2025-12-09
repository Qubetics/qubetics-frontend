import { formatDecimal } from "@/utils/commonFunctions";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

const AnalyticGraph = ({ apiData }) => {
  const transferAmountSeries = apiData?.map((item) => [
    item.createdAt * 1000, // Convert seconds to milliseconds
    // If a value exists, simplify it and then convert it back to Number (or keep as string if only for display)
    item.count.transferAmount
      ? Number(formatDecimal(item.count.transferAmount))
      : 0,
  ]);

  const transferCountSeries = apiData?.map((item) => [
    item.createdAt * 1000,
    item.count.transferCount
      ? Number(formatDecimal(item.count.transferCount))
      : 0,
  ]);

  const uniqueSendersSeries = apiData?.map((item) => [
    item.createdAt * 1000,
    item.count.uniqueSenders
      ? Number(formatDecimal(item.count.uniqueSenders))
      : 0,
  ]);
  const uniqueReciverSeries = apiData?.map((item) => [
    item.createdAt * 1000,
    item.count.uniqueReceivers
      ? Number(formatDecimal(item.count.uniqueReceivers))
      : 0,
  ]);
  const totalUniqueSeries = apiData?.map((item) => [
    item.createdAt * 1000,
    item.count.totalUniques
      ? Number(formatDecimal(item.count.totalUniques))
      : 0,
  ]);

  const options = {
    chart: {
      backgroundColor: "#0E0E10",
      marginLeft: 100,
      marginRight: 100,
      inverted: false,
    },
    title: {
      text: "Time Series: Token Contract Overview",
      align: "left",
      style: { color: "#ffffff", fontSize: "22px" },
    },
    xAxis: {
      type: "datetime",
      labels: { style: { color: "#A0A0A3" } },
    },
    yAxis: [
      {
        title: {
          text: "Amount", // Make sure this is not null or empty
        },
        labels: { style: { color: "#A0A0A3" } },
      },
      {
        title: {
          text: "Token Transfer Count",
          style: { color: "#A0A0A3" },
        },
        labels: { style: { color: "#A0A0A3" } },
        opposite: true,
      },
    ],
    tooltip: {
      shared: true,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      style: { color: "#ffffff" },
    },
    legend: {
      enabled: true,
      layout: "horizontal",
      align: "center",
      itemHoverStyle: { color: "#A0A0A3" },
      itemStyle: {
        color: "white",
      },
      verticalAlign: "bottom",
    },
    series: [
      {
        name: "Transfer Amount",
        data: transferAmountSeries,
        color: "magenta",
        type: "column",
        yAxis: 0,
        // visible: enabledSeries["Transfer Amount"],
      },
      {
        name: "Transfer Count",
        data: transferCountSeries,
        color: "#FF69B4",
        type: "line",
        yAxis: 1,
        // visible: enabledSeries["Transfer Count"],
      },
      {
        name: "Unique Receivers",
        data: uniqueReciverSeries,
        color: "#FFD700",
        type: "line",
        yAxis: 1,
        // visible: enabledSeries["Unique Receivers"],
      },
      {
        name: "Unique Senders",
        data: uniqueSendersSeries,
        color: "#FFA500",
        type: "line",
        yAxis: 1,
        // visible: enabledSeries["Unique Senders"],
      },
      {
        name: "Total Uniques",
        data: totalUniqueSeries,
        color: "#00FFFF",
        type: "line",
        yAxis: 1,
        // visible: enabledSeries["Total Uniques"],
      },
    ],
    rangeSelector: {
      selected: 1,
    },
    navigator: {
      enabled: true,
    },
    scrollbar: {
      enabled: false,
    },
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      //   constructorType={"stockChart"}
    />
  );
};

// Dummy Data Generator
// function generateDummyData() {
//   let data = [];
//   let time = Date.UTC(2018, 0, 1);
//   for (let i = 0; i < 100; i++) {
//     data.push([time, Math.floor(Math.random() * 10000)]);
//     time += 86400000; // Increment by 1 day
//   }

//   return data;
// }

export default AnalyticGraph;
