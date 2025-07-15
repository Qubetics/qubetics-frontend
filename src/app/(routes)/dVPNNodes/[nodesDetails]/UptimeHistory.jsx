"use client";
import ChartAccounts from "@/components/chart/ChartAccounts";
import { Select, Space } from "antd";

const UptimeHistory = (props) => {
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
              defaultValue="7d"
              style={{ width: 80 }}
              disabled // disabled since no dynamic logic
              options={[
                { label: "7d", value: "7d" },
                { label: "30d", value: "30d" },
              ]}
            />
          </Space>
        </div>

        {/* Static chart */}
        <ChartAccounts data={staticData} chartType="7d" name="Uptime %" />
      </div>
    </div>
  );
};

export default UptimeHistory;
