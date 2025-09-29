"use client";
import "@/app/(routes)/dashboard/dashboard.scss";
import Page from "@/app/(routes)/notfound/page";
import ChartAccounts from "@/components/chart/ChartAccounts";
import { useLatestData } from "@/components/contexts/latest_data";
import CustomBreadcrumb from "@/components/CustomBreadcrumb/CustomBreadcrumb";
import Loader from "@/components/loader/Loader";
import { ALL_CHART_THRITY_DAYS, graphItems } from "@/constant/graphTableValues";
import getCoinTransactionGraph from "@/services/getCoinTransactionGraph";
import { chartTimeType } from "@/utils/chartTimeType";
import { Col, Row, Select, Space } from "antd";
import { useEffect, useState } from "react";
import "../../chartstats/ChartStats.scss";
const breadcrumbItems = [
  { href: "/", label: "Qubetics Charts & Statistics" },
  { href: "/user", label: "Qubetics Price Analytics" },
];
const CoinTransactionGraph = () => {
  const [coinTransChart, setCoinTransChart] = useState({
    data: [],
    type: ALL_CHART_THRITY_DAYS,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const webSocketData = useLatestData();

  /*Coin Transaction Graph*/
  useEffect(() => {
    if (webSocketData?.transferGraph?.finalData) {
      chartTimeType(
        setCoinTransChart,
        coinTransChart,
        webSocketData?.transferGraph
      );
    }
  }, [webSocketData?.transferGraph]);

  useEffect(() => {
    getCoinTransactionGraph(coinTransChart?.type)
      .then((res) => {
        setCoinTransChart({
          ...coinTransChart,
          data: res?.data?.finalData,
          count: res?.data?.count,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        return err;
      });
  }, [coinTransChart?.type]);
  const handleCoinTransSelect = (val) => {
    setCoinTransChart({
      ...coinTransChart,
      type: val,
    });
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="container">
      <CustomBreadcrumb
        items={breadcrumbItems}
        activeIndex={2}
        activeClassName="active-breadcrumb-item"
      />
      <div className="chart_secTransection">
        <h2 className="headingCom">Daily Coin Transactions</h2>
        <p>
          It is a graphical representation of historical coin transactions which
          took place in the blockchain.
        </p>
        <Row gutter={[25, 20]}>
          <Col className="gutter-row" xs={24}>
            <div className="graphOuter_1">
              <div className="drop_histry">
                <div className="drop_histry__blinkLive">
                  <h3>
                    tx Count{" "}
                    <span>
                      {coinTransChart?.count ? coinTransChart?.count : 0}
                    </span>
                  </h3>
                  <span className="liveblink">Live</span>
                </div>
                <Space wrap>
                  <Select
                    getPopupContainer={(trigger) => trigger.parentNode}
                    defaultValue={ALL_CHART_THRITY_DAYS}
                    style={{ width: 120 }}
                    onChange={handleCoinTransSelect}
                    options={graphItems}
                  />
                </Space>
              </div>
              {coinTransChart?.data?.length > 0 ? (
                <ChartAccounts
                  data={coinTransChart?.data}
                  chartType={coinTransChart?.type}
                  name="Coin Transfer"
                />
              ) : (
                <div className="chartLoader">
                  {" "}
                  <Page />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CoinTransactionGraph;
