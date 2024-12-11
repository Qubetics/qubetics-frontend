import {
  ALL_CHARTS_HOUR,
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";
import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getCoinTransactionGraph(chartType) {
  try {
    const data =
      chartType === ALL_CHARTS_HOUR
        ? {
          interval: 60,
          time: "mintue",
        }
        : chartType === ALL_CHART_ONE_DAY
          ? {
            interval: 24,
            time: "hourly",
          }
          : chartType === TRANS_HISTORY_CHART_YEAR
            ? {
              interval: 12,
              time: "monthly",
            }
            : chartType === ALL_CHART_SEVEN_DAY
              ? { interval: 7, time: "daily" }
              : { interval: 30, time: "daily" };

    const response = await fetch(
      `${EXPLORER_API_URL}explorer/graph/coin-transfer?interval=${data?.interval}&time=${data?.time}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
