"use client";

import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import "./ChainAbstractionAnalytics.scss";
import getOnChainAnalyticsChart from "@/services/getOnChainAnalyticsChart"; // API call onChain
import getLoadOverTimeChart from "@/services/getLoadOverTimeChart"; // API call loadOverTime
import getDailyActiveUserChart from "@/services/getDailyActiveUserChart"; // API call activeUsers
import RenderChartCard from "./RenderChartCard"; // renderChartCart custom component

const ChainAbstractionAnalytics = () => {
  const [onChainData, setOnChainData] = useState([]);
  const [loadOverTimeData, setLoadOverTimeData] = useState([]);
  const [dailyActiveUserData, setDailyActiveUserData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const onChain = await getOnChainAnalyticsChart();
      const loadTime = await getLoadOverTimeChart();
      const activeUsers = await getDailyActiveUserChart();

      setOnChainData(onChain?.data || []);
      setLoadOverTimeData(loadTime?.data || []);
      setDailyActiveUserData(activeUsers?.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  //Helpers to extract categories and values
  const extractChartData = (data, categorykey, valueKey) => {
    const categories = data?.map((item) => item[categorykey]);
    const values = data?.map((item) => item[valueKey]);
    return { categories, values };
  };

  const onChain = extractChartData(onChainData, "target_chain", "count");
  const loadOver = extractChartData(loadOverTimeData, "date", "count");
  const activeUsers = extractChartData(dailyActiveUserData, "date", "count");

  return (
    <div className="abstraction_analytics">
      <Row className="margin-30">
        <Col lg={24}>
          <RenderChartCard
            title="Transaction load / day"
            chartType="areaspline"
            categories={loadOver?.categories}
            seriesData={loadOver?.values}
            seriesName={"Total Tx"}
            loading={loading}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="margin-30">
        <Col xs={24} md={12}>
          <RenderChartCard
            title="Intent settlement"
            chartType="bar"
            categories={onChain?.categories}
            seriesData={onChain?.values}
            seriesName={"Intent settlement"}
            loading={loading}
          />
        </Col>

        <Col xs={24} md={12}>
          <RenderChartCard
            title="Active users / day"
            chartType="areaspline"
            categories={activeUsers?.categories}
            seriesData={activeUsers?.values}
            seriesName={"Users"}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ChainAbstractionAnalytics;
