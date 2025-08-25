import { generateData } from "@/constant/constant";
import moment from "moment";

const {
  TRANS_HISTORY_CHART_SECONDS,
  ALL_CHART_ONE_DAY,
  ALL_CHARTS_HOUR,
  TRANS_HISTORY_CHART_MINUTES,
  TRANS_HISTORY_CHART_YEAR,
  ALL_CHART_THRITY_DAYS,
} = require("@/constant/graphTableValues");

export const chartMenu = (data, chartType) => {
  let labelIndex = [];
  if (
    chartType === TRANS_HISTORY_CHART_SECONDS ||
    chartType === ALL_CHART_ONE_DAY ||
    chartType === ALL_CHARTS_HOUR
  ) {
    labelIndex = data?.length
      ? data?.map((item, index) => moment(item?.createdAt).format("hh:mm:ss a"))
      : generateData(chartType).map((item, index) =>
          moment(item.createdAt).format("hh:mm:ss a")
        );
  } else if (chartType === ALL_CHART_ONE_DAY || chartType === ALL_CHARTS_HOUR) {
    labelIndex =
      data?.length > 0
        ? data?.map((item, index) => moment(item?.createdAt).format("hh:mm a"))
        : generateData(chartType).map((item, index) =>
            moment(item.createdAt).format("hh:mm a")
          );
  } else if (chartType === TRANS_HISTORY_CHART_MINUTES) {
    labelIndex =
      data?.lenght > 0
        ? data?.map((item, index) => moment(item?.createdAt).format("DD MMM "))
        : generateData(chartType).map((item, index) =>
            moment(item.createdAt).format("DD MMM ")
          );
  } else if (chartType === ALL_CHART_THRITY_DAYS) {
    labelIndex =
      data?.lenght > 0
        ? data?.map((item, index) => moment(item?.createdAt).format("DD MMM "))
        : generateData(chartType).map((item, index) =>
            moment(item.createdAt).format("DD MMM ")
          );
  } else if (chartType === TRANS_HISTORY_CHART_YEAR) {
    labelIndex =
      data?.lenght > 0
        ? data?.map((item, index) =>
            moment(item?.createdAt)?.format(" MMM YYYY ")
          )
        : generateData(chartType).map((item, index) =>
            moment(item.createdAt).format(" MMM YYYY ")
          );
  } else {
    labelIndex =
      data?.length > 0
        ? data?.map((item, index) =>
            moment(item?.createdAt)?.format("DD MMM YYYY")
          )
        : generateData(chartType).map((item, index) =>
            moment(item.createdAt).format("DD MMM YYYY")
          );
  }

  return labelIndex;
};

export const chartSeriesValue = (data, chartType) => {
  const finalResult = data?.length > 0 ? data : generateData(chartType);
  let maximum = 0;
  maximum = finalResult?.reduce(
    (max, obj) => (obj.count > max.count ? obj : max),
    finalResult[0]
  );

  let seriesData = finalResult?.map((e) => {
    if (typeof e?.count === "number") {
      return e?.count;
    } else {
      return Number(e?.count).noExponents();
    }
  });
  return { seriesData, maximum };
};
