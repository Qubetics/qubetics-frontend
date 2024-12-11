import {
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";
import { EXPLORER_API_URL } from "@/constant/constant";

export default async function getTokenPriceGraph(chartType) {
  try {
    const data =
      chartType === ALL_CHART_ONE_DAY
        ? {
          interval: 1,
          time: "d",
        }
        : chartType === TRANS_HISTORY_CHART_YEAR
          ? {
            interval: 1,
            time: "y",
          }
          : chartType === ALL_CHART_SEVEN_DAY
            ? { interval: 7, time: "d" }
            : { interval: 30, time: "d" };

    const response = await fetch(
      `${EXPLORER_API_URL}explorer/graph/token-price?interval=${data?.interval}&time=${data?.time}`
    );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
