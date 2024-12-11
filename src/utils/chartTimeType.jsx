import {
  ALL_CHARTS_HOUR,
  ALL_CHART_ONE_DAY,
  ALL_CHART_SEVEN_DAY,
  ALL_CHART_THRITY_DAYS,
  TRANS_HISTORY_CHART_HOURS,
  TRANS_HISTORY_CHART_MINUTES,
  TRANS_HISTORY_CHART_SECONDS,
} from "@/constant/graphTableValues";

export const chartTimeType = (chartSetState, chartState, socketData) => {
  switch (chartState?.type) {
    case ALL_CHARTS_HOUR:
      chartSetState({
        ...chartState,
        data: socketData?.finalData?.oneHour,
        count: socketData?.count,
      });
      break;
    case ALL_CHART_ONE_DAY:
      chartSetState({
        ...chartState,
        data: socketData?.finalData?.oneDay,
        count: socketData?.count,
      });
      break;
    case ALL_CHART_SEVEN_DAY:
      chartSetState({
        ...chartState,
        data: socketData?.finalData?.sevenDay,
        count: socketData?.count,
      });
      break;
    case ALL_CHART_THRITY_DAYS:
      chartSetState({
        ...chartState,
        data: socketData?.finalData?.thirtyDay,
        count: socketData?.count,
      });
      break;
    case TRANS_HISTORY_CHART_SECONDS:
      chartSetState({
        ...chartState,
        data: socketData?.finalData?.tenSecond,
      });
      break;
    case TRANS_HISTORY_CHART_MINUTES:
      chartSetState({
        ...chartState,
        data: socketData?.finalData?.thirtyMinute,
      });
      break;
    case TRANS_HISTORY_CHART_HOURS:
      chartSetState({
        ...chartState,
        data: socketData?.finalData?.sixHour,
      });
      break;

    default:
      chartSetState({
        ...chartState,
        data: socketData?.finalData?.oneHour,
        count: socketData?.count,
      });
      break;
  }
};
