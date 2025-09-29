import { currencyName } from "@/constant/constant";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";

const HistoryPriceGraph = () => {
  const options = {
    chart: {
      backgroundColor: "#0E0E10",
      marginLeft: 100,
      marginRight: 100,
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "datetime",
      labels: { style: { color: "#A0A0A3" } },
    },
    yAxis: [
      {
        title: {
          text: `Tether ${currencyName} Daily Price(USD)`, // Make sure this is not null or empty
        },
        labels: { style: { color: "#A0A0A3" } },
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
      verticalAlign: "bottom",
    },
    series: [
      {
        name: `Tether ${currencyName} Daily Price`,
        data: generateDummyData(),
        color: "magenta",
        type: "line",
        yAxis: 0,
        // visible: enabledSeries["Transfer Amount"],
      },
      {
        name: "ICO Price",
        data: generateDummyData(),
        color: "#FF69B4",
        type: "line",
        yAxis: 0,
        // visible: enabledSeries["Transfer Count"],
      },
    ],
    rangeSelector: {
      selected: 1,
    },
    // navigator: {
    //   enabled: true,
    // },
    // scrollbar: {
    //   enabled: false,
    // },
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
function generateDummyData() {
  let data = [];
  let time = Date.UTC(2018, 0, 1);
  for (let i = 0; i < 100; i++) {
    data.push([time, Math.floor(Math.random() * 10000)]);
    time += 86400000; // Increment by 1 day
  }
  return data;
}

export default HistoryPriceGraph;
