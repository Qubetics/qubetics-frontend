import React from "react";
import { Collapse, ConfigProvider, Space } from "antd";
import "./event_log.scss";

const EventLogs = ({ logs }) => {
  const items =
    logs[0]?.events?.map((val, index) => ({
      key: String(index),
      label: `#${val?.type}`,
      children: (
        <div className="collapsData">
          <p className="title">Event Logs</p>
          <div className="actions">
            {val?.attributes?.map((attr, idx) => (
              <div className="action" key={idx}>
                <span>{attr?.key}: </span>
                <span>{attr?.value}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    })) || [];

  const onChange = (key) => {
    console.log("Active panel key:", key);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerBg: "#121212",
            contentBg: "#121212",
            headerPadding: "8px 16px",
            contentPadding: "12px 16px",
            colorText: "#fff",
            colorBorder: "#3f3f55",
            headerFontSize: 14,
            contentFontSize: 13,
          },
        },
        token: {
          borderRadius: 8,
          colorPrimary: "#fff",
        },
      }}
    >
      <div className="customCollapse">
        <Collapse items={items} onChange={onChange} expandIconPosition="end" />
      </div>
    </ConfigProvider>
  );
};

export default EventLogs;
