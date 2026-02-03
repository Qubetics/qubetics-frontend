import React from "react";
import { Collapse, ConfigProvider } from "antd";
import "./event_log.scss";

const EventLogs = ({ logs }) => {
  const items =
    logs[0]?.events?.map((val, index) => ({
      key: String(index),
      label: `#${val?.type}`,
      children: (
        <div className="collapsData">
          <p className="title">Event Logs</p>
          <se>
            {val?.attributes?.map((attr, idx) => (
              <p className="action actiondata" key={idx}>
                <span>{attr?.key}: </span>
                <span>{attr?.value}</span>
              </p>
            ))}
          </se>
        </div>
      ),
    })) || [];

  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerBg: "#121212", // Header background color
            contentBg: "#121212", // Content background color
            headerPadding: "8px 16px", // Padding for header
            contentPadding: "12px 16px",
            colorText: "#fff", // Text color
            colorBorder: "#3f3f55", // Border color
            headerFontSize: 14, // Header font size
            contentFontSize: 13,
          },
        },
        token: {
          borderRadius: 8, // Rounded corners
          colorPrimary: "#fff", // Primary color for active state
        },
      }}
    >
      <div className="customCollapse">
        <Collapse items={items} expandIconPosition="end" />
      </div>
    </ConfigProvider>
  );
};

export default EventLogs;
