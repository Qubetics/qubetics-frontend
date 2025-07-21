// import { Col, Row, Space } from "antd";
import "./ChainAbstractionAnalytics.scss";
// import { SwapIconSvg, LockIcon, BlockChains } from "../../../public/SvgIcons";
import { Select } from "antd";
import ChartComponent from "../../Charts/ChartComponent";

const ChainAbstractionAnalytics = () => {
  // const data = [
  //   {
  //     text: "Total Cross-Chain Transactions",
  //     balance: "1.92M",
  //     img: <SwapIconSvg />,
  //   },
  //   { text: "Total Value Locked", balance: "$67.5M", img: <LockIcon /> },
  //   { text: "Chains Connected", balance: "17", img: <BlockChains /> },
  // ];

  const transactionItems = [
    { value: "abc", label: "14 Day" },
    { value: "bcv", label: "bcv" },
    { value: "edf", label: "edf" },
  ];

  return (
    <div className="abstraction_analytics">
      {/* <Row gutter={[20, 20]}>
        {data.map((item, index) => (
          <Col lg={8} key={index}>
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

      {/* <Row gutter={[20, 20]} className="margin-30">
        <Col lg={12}> */}
      <div className="abstraction_chart_card">
        <div className="abstraction_chart_card_head">
          <h3>On Chain Analytics</h3>
          <div className="abstraction_chart_card_right">
            <h4 className="value">
              Avg: <span> 2m 34s</span>
            </h4>
            <h4 className="value">
              Today: <span> 2m 12s</span>
            </h4>
          </div>
        </div>
        <div className="abstraction_chart_card_content">
          <ChartComponent chartType="bar" />
        </div>
      </div>
      {/* </Col>
        <Col lg={12}> */}
      <div className="abstraction_chart_card">
        <div className="abstraction_chart_card_head">
          <h3>Transaction Load Over Time</h3>
          <div className="abstraction_chart_card_right ddddd">
            {/* <Space wrap> */}
            <Select style={{ width: 80 }} options={transactionItems} />
            {/* </Space> */}
          </div>
        </div>
        <div className="abstraction_chart_card_content">
          <ChartComponent chartType="areaspline" />
        </div>
      </div>
      {/* </Col>
      </Row> */}

      {/* <Row gutter={[20, 20]} className="margin-30"> */}
      {/* <Col lg={12}>
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
              <div>
                <CircleComponent />
                <ChartComponent chartType="column" />
              </div>
            </div>
          </div>
        </Col> */}
      {/* <Col lg={12}> */}
      <div className="abstraction_chart_card">
        <div className="abstraction_chart_card_head">
          <h3>Active Users/Day</h3>
          <div className="abstraction_chart_card_right">
            <Select
              style={{ width: 80, color: "white" }}
              options={transactionItems}
            />
          </div>
        </div>
        <div className="abstraction_chart_card_content">
          <ChartComponent chartType="areaspline" />
        </div>
      </div>
      {/* </Col>
      </Row> */}
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
