"use client";

import ChartComponent from "@/Charts/ChartComponent";
import { Spin } from "antd";
import React from "react";

const RenderChartCard = ({
  title,
  chartType,
  categories,
  seriesData,
  seriesName,
  loading,
}) => {
  return (
    <div className="abstraction_chart_card">
      <div className="abstraction_chart_card_head">
        <h3>{title}</h3>
      </div>
      <div
        className={`${
          loading ? "spin_loader" : "abstraction_chart_card_content"
        }`}
      >
        {loading ? (
          <Spin role="status" />
        ) : !categories?.length ? (
          <p className="not_found">
            Data not found
          </p>
        ) : (
          <ChartComponent
            chartType={chartType}
            categories={categories}
            seriesData={seriesData}
            seriesName={seriesName}
          />
        )}
      </div>
    </div>
  );
};

export default RenderChartCard;
