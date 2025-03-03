import { EXPLORER_API_URL } from "@/constant/constant";
import {
  TRANS_HISTORY_CHART_MINUTES,
  TRANS_HISTORY_CHART_SECONDS,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";

export default async function getTransactionGraph(chartType) {
  try {
    const getData = (chartType) => {
      return chartType === TRANS_HISTORY_CHART_SECONDS
        ? { interval: 24, time: "hourly" }
        : chartType === TRANS_HISTORY_CHART_YEAR
        ? { interval: 12, time: "monthly" }
        : chartType === TRANS_HISTORY_CHART_MINUTES
        ? { interval: 7, time: "daily" }
        : { interval: 30, time: "daily" };
    };
    const data = getData(chartType);

    const response = await fetch(
      `${EXPLORER_API_URL}explorer/graph/tps?interval=${data?.interval}&time=${data?.time}`
    );

    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
