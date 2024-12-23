import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";
import {
  TRANS_HISTORY_CHART_MINUTES,
  TRANS_HISTORY_CHART_SECONDS,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";

export default async function getTransactionGraph(chartType) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  if (chain === null || chain === undefined) {
    chain = "EVM Chain";
  }
  try {
    const getData = (chain, chartType) => {
      const isEVM = chain === "EVM Chain";
      return chartType === TRANS_HISTORY_CHART_SECONDS
        ? { interval: isEVM ? 24 : 1, time: "hourly" }
        : chartType === TRANS_HISTORY_CHART_YEAR
        ? { interval: isEVM ? 12 : 1, time: "y" }
        : chartType === TRANS_HISTORY_CHART_MINUTES
        ? { interval: 7, time: isEVM ? "daily" : "d" }
        : { interval: 30, time: isEVM ? "daily" : "d" };
    };
    const data = getData(chain, chartType);

    const response =
      chain == "EVM Chain"
        ? await fetch(
            `${EXPLORER_API_URL}explorer/graph/tps?interval=${data?.interval}&time=${data?.time}`
          )
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}explorer/graph/tps?interval=${data?.interval}&time=${data?.time}`
          );
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
