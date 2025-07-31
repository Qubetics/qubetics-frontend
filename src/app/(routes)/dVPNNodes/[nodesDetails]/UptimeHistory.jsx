"use client";
import { Select, Space } from "antd";
import ChartAccounts from "@/components/chart/ChartAccounts";
import { trackEvent } from "@/utils/eventTrack";
import {
  ALL_CHART_SEVEN_DAY,
  transactionItems,
} from "@/constant/graphTableValues";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";
import { useEffect, useState } from "react";
import getUpTimeHistory from "@/services/getUpTimeHistory";
import GraphLoading from "@/components/loader/GraphLoading";

const UptimeHistory = ({ nodeName }) => {
  const [uptimeHistoryStatus, setUptimeHistoryStatus] = useState(InitStatus); //init,fetching,success,error
  const [uptimeHistoryChart, setUptimeHistoryChart] = useState({
    data: [],
    type: ALL_CHART_SEVEN_DAY,
  });

  // Static dummy data
  const staticData = [
    { time: "2025-07-01", value: 99.95 },
    { time: "2025-07-02", value: 99.97 },
    { time: "2025-07-03", value: 99.92 },
    { time: "2025-07-04", value: 99.96 },
    { time: "2025-07-05", value: 99.94 },
    { time: "2025-07-06", value: 99.98 },
    { time: "2025-07-07", value: 99.99 },
  ];

  const handleUptimeHistory = (value) => {
    trackEvent({
      action: "button_click",
      category: "Dashboard_TransactionHistory",
      label: `total_transactions ${value}`,
    });
    setUptimeHistoryChart({ ...uptimeHistoryChart, type: value });
  };

  const fetchChartData = async () => {
    setUptimeHistoryStatus(FetchingStatus);
    await getUpTimeHistory(uptimeHistoryChart?.type, nodeName)
      .then((res) => {
        setUptimeHistoryStatus(SuccessStatus);
        setUptimeHistoryChart({
          ...uptimeHistoryChart,
          data: res?.data,
        });
      })
      .catch((err) => {
        setUptimeHistoryStatus(ErrorStatus);
        return err;
      });
  };

  useEffect(() => {
    fetchChartData();
  }, [uptimeHistoryChart?.type]);

  return (
    <div style={{ position: "relative" }}>
      <div className="graphOuter_1 uptimeHisgraph">
        <div className="drop_histry">
          <div className="drop_histry__blinkLive">
            <h3>Uptime History</h3>
          </div>

          <Space wrap>
            <Select
              title=""
              getPopupContainer={(trigger) => trigger.parentNode}
              defaultValue={ALL_CHART_SEVEN_DAY}
              style={{ width: 80 }}
              onChange={handleUptimeHistory}
              options={transactionItems}
            />
          </Space>
        </div>

        {/* Static chart */}
        {uptimeHistoryStatus === InitStatus ||
        uptimeHistoryStatus === FetchingStatus ? (
          <div className="graphLod dashLoading">
            {" "}
            <GraphLoading />
          </div>
        ) : (
          <ChartAccounts
            data={uptimeHistoryChart?.data}
            chartType={uptimeHistoryChart?.type}
            name="Uptime %"
          />
        )}
      </div>
    </div>
  );
};

export default UptimeHistory;
