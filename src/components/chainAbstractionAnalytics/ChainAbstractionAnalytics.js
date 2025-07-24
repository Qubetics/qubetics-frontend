import { useEffect, useState } from "react";
import { Col, Row } from "antd";
import "./ChainAbstractionAnalytics.scss";
// import { SwapIconSvg, LockIcon, BlockChains } from "../../../public/SvgIcons";
// import { Select } from "antd";
import ChartComponent from "../../Charts/ChartComponent";
import getOnChainAnalyticsChart from "@/services/getOnChainAnalyticsChart";
import getLoadOverTimeChart from "@/services/getLoadOverTimeChart";
import getDailyActiveUserChart from "@/services/getDailyActiveUserChart";

const ChainAbstractionAnalytics = () => {
  const [onChainData, setOnChainData] = useState([]);
  const [loadOverTimeData, setLoadOverTimeData] = useState([]);
  const [dailyActiveUserData, setDailyActiveUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const onChain = await getOnChainAnalyticsChart();
      const loadTime = await getLoadOverTimeChart();
      const activeUsers = await getDailyActiveUserChart();

      setOnChainData(onChain?.Data || []);
      setLoadOverTimeData(loadTime?.Data || []);
      setDailyActiveUserData(activeUsers?.Data || []);
    };

    fetchData();
  }, []);

  //Helpers to extract categories and values
  const extractChartData = (data, categorykey, valueKey) => {
    const categories = data.map((item) => item[categorykey]);
    const values = data.map((item) => item[valueKey]);
    return { categories, values};
  };

  const onChain = extractChartData(onChainData, "target_chain", "count");
  const loadOver = extractChartData(loadOverTimeData, "date", "count");
  const activeUsers = extractChartData(dailyActiveUserData, "date", "count");

  // const data = [
  //   {
  //     text: "Total Cross-Chain Transactions",
  //     balance: "1.92M",
  //     img: <SwapIconSvg />,
  //   },
  //   { text: "Total Value Locked", balance: "$67.5M", img: <LockIcon /> },
  //   { text: "Chains Connected", balance: "17", img: <BlockChains /> },
  // ];

  // const transactionItems = [
  //   { value: "abc", label: "14 Day" },
  //   { value: "bcv", label: "bcv" },
  //   { value: "edf", label: "edf" },
  // ];

  return (
    <div className="abstraction_analytics">
      {/* <Row gutter={[20, 20]}>
        {data.map((item, index) => (
          <Col lg={8} md={12} sm={24} xs={24} key={index}>
            <div className="abstraction_analytic_card ">
              <div className="imgIcon">{item.img}</div>
              <div>
                <p>{item.text}</p>
                <h2>{item.balance}</h2>
              </div>
            </div>
          </Col>
        ))}
      </Row> */}

      <Row gutter={[20, 20]} className="margin-30">
        <Col xs={24}>
          <div className="abstraction_chart_card">
            <div className="abstraction_chart_card_head ">
              <h3>On Chain Analytics</h3>
              {/* <div className="abstraction_chart_card_right">
                <h4 className="value">
                  Avg: <span> 2m 34s</span>
                </h4>
                <h4 className="value">
                  Today: <span> 2m 12s</span>
                </h4>
              </div> */}
            </div>
            <div className="abstraction_chart_card_content">
              <ChartComponent chartType="bar" categories={onChain.categories} seriesData={onChain.values}/>
            </div>
          </div>
        </Col>

        <Col xs={24}>
          <div className="abstraction_chart_card">
            <div className="abstraction_chart_card_head">
              <h3>Transaction Load Over Time</h3>
              {/* <div className="abstraction_chart_card_right ddddd">
                <Select
                  defaultValue={"14 day"}
                  options={transactionItems} />
              </div> */}
            </div>
            <div className="abstraction_chart_card_content">
              <ChartComponent chartType="areaspline" categories={loadOver.categories} seriesData={loadOver.values}/>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="margin-30">
        {/*  <Col lg={12}>
          <div className="abstraction_chart_card">
            <div className="abstraction_chart_card_head">
              <h3>Top Tokens Transferred</h3>
              <div className="abstraction_chart_card_right">
                <h4 className="value">
                  <span> $2.7M</span>
                </h4>
              </div>
            </div>
            <div className="abstraction_chart_card_content">
              <CircleComponent />
              <ChartComponent chartType="column" />
            </div>
          </div>
        </Col> */}

        <Col xs={24}>
          <div className="abstraction_chart_card">
            <div className="abstraction_chart_card_head">
              <h3>Active Users/Day</h3>
              {/* <div className="abstraction_chart_card_right">
                <Select
                  defaultValue={"30 day"}
                  options={transactionItems}
                />
              </div> */}
            </div>
            <div className="abstraction_chart_card_content">
              <ChartComponent chartType="areaspline" categories={activeUsers.categories} seriesData={activeUsers.values} />
            </div>
          </div>
        </Col>
      </Row>
      {/* <div className="abstraction_chart_card margin-30">
        <div className="abstraction_chart_card_head">
          <h3>Top Chains by Activity</h3>
          <div className="abstraction_chart_card_right">
            <h4 className="value">
              <span> By Transactions</span>
            </h4>
            <h4 className="value">
              <span> By Volume</span>
            </h4>
          </div>
        </div>
        <div className="abstraction_chart_card_content">
          <ChartComponent chartType="bar" />
        </div>
      </div> */}
    </div>
  );
};

export default ChainAbstractionAnalytics;
