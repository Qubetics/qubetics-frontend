import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";
import {
  ALL_CHARTS_HOUR,
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";

export default async function getTotalAccountGraph(chartType) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  try {
    const getData = (chain, chartType) => {
      const isEVM = chain === "EVM Chain";
      return chartType === ALL_CHARTS_HOUR
        ? { interval: isEVM ? 60 : 1, time: isEVM ? "mintue" : "h" }
        : chartType === ALL_CHART_ONE_DAY
        ? { interval: isEVM ? 24 : 1, time: isEVM ? "hourly" : "d" }
        : chartType === TRANS_HISTORY_CHART_YEAR
        ? { interval: isEVM ? 12 : 1, time: isEVM ? "monthly" : "y" }
        : chartType === ALL_CHART_SEVEN_DAY
        ? { interval: 7, time: isEVM ? "daily" : "d" }
        : { interval: 30, time: isEVM ? "daily" : "d" };
    };
    const data = getData(chain, chartType);
    const response =
      chain == "EVM Chain"
        ?
         await fetch(
            `${EXPLORER_API_URL}explorer/graph/account?interval=${data?.interval}&time=${data?.time}`
          )
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}explorer/graph/account?interval=${data?.interval}&time=${data?.time}`
          );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
