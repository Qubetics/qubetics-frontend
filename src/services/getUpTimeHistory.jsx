import { NATIVE_EXPLORER_API_URL } from "@/constant/constant";
import {
  TRANS_HISTORY_CHART_7_DAYS,
  TRANS_HISTORY_CHART_30_DAYS,
  TRANS_HISTORY_CHART_YEAR,
} from "@/constant/graphTableValues";

export const getUpTimeHistory = async (chartType, nodeName) => {
  try {
    const customChart = (chartType) => {
      if (chartType === TRANS_HISTORY_CHART_7_DAYS) {
        return { duration: "7d" };
      } else if (chartType === TRANS_HISTORY_CHART_30_DAYS) {
        return { duration: "30d" };
      } else if (chartType === TRANS_HISTORY_CHART_YEAR) {
        return { duration: "365d" };
      } else {
        return { duration: "7d" };
      }
    };
    const data = customChart(chartType);

    const response = await fetch(
      `${NATIVE_EXPLORER_API_URL}session/up-timehistory?nodeAddress=${nodeName}&duration=${data?.duration}`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};
