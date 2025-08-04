import { EXPLORER_API_URL, NATIVE_EXPLORER_API_URL } from "@/constant/constant";
import {
  ALL_CHARTS_HOUR,
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";

export const getGraphData = async (chartType, fetchUrl, chartTitle) => {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  if (chain === null || chain === undefined) {
    chain = "EVM Chain";
  }

  try {
    const data =
      chartType === ALL_CHARTS_HOUR
        ? {
            interval: 60,
            time: "m",
          }
        : chartType === ALL_CHART_ONE_DAY
        ? {
            interval: 24,
            time: "h",
          }
        : chartType === TRANS_HISTORY_CHART_YEAR
        ? {
            interval: 1,
            time: "y",
          }
        : chartType === ALL_CHART_SEVEN_DAY
        ? { interval: 7, time: "d" }
        : { interval: 30, time: "d" };

    const response =
      chain === "EVM Chain" || chartTitle !== "Total Accounts"
        ? await fetch(
            `${EXPLORER_API_URL}${fetchUrl}?interval=${data?.interval}&time=${data?.time}`
          )
        : await fetch(
            `${NATIVE_EXPLORER_API_URL}${fetchUrl}?interval=${data?.interval}&time=${data?.time}`
          );
    let result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
