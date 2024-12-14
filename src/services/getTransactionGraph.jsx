import { EXPLORER_API_URL } from "@/constant/constant";
import {
  TRANS_HISTORY_CHART_MINUTES,
  TRANS_HISTORY_CHART_SECONDS,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";

export default async function getTransactionGraph(chartType) {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  try {
    const getData = (chain, chartType) => {
      // const isEVM = chain === "EVM Chain";
      return chartType === TRANS_HISTORY_CHART_SECONDS
        ? { interval: 24, time: "hourly" }
        : chartType === TRANS_HISTORY_CHART_YEAR
        ? { interval: 12, time: "monthly" }
        : chartType === TRANS_HISTORY_CHART_MINUTES
        ? { interval: 7, time: "daily" }
        : { interval: 30, time: "daily" };
    };
    const data = getData(chain, chartType);

    const response =
      // chain == "EVM Chain"
      //   ?
      await fetch(
        `${EXPLORER_API_URL}explorer/graph/tps?interval=${data?.interval}&time=${data?.time}`
      );
    // : await fetch(
    //     `${NATIVE_EXPLORER_API_URL}explorer/graph/tps?interval=${data?.interval}&time=${data?.time}`
    //   );
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
}
