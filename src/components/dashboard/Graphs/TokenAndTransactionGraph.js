"use client";
import Page from "@/app/(routes)/notfound/page";
import ChartAccounts from "@/components/chart/ChartAccounts";
import TokenPriceChart from "@/components/chart/TokenPriceChart";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import Loader from "@/components/loader/Loader";
import { EXPLORER_CHAIN_NAME, tooltipConstant } from "@/constant/constant";
import {
  ALL_CHART_THRITY_DAYS,
  DefaultValueOfToken,
  graphItems,
  tokenGraphItems
} from "@/constant/graphTableValues";
import getCoinTransactionGraph from "@/services/getCoinTransactionGraph";
import getTokenPriceGraph from "@/services/getTokenGraph";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Col, Row, Select, Space, Tooltip } from "antd";
import { useEffect, useState } from "react";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";
const { Option } = Select;

const TokenAndTransactionGraph = () => {
  let val = typeof window !== "undefined" && localStorage.getItem("chainType");
  const [tokenPriceChart, setTokenPriceChart] = useState({
    data: [],
    type: DefaultValueOfToken,
    price: 0,
  });
  const [coinTransChart, setCoinTransChart] = useState({
    data: [],
    type: ALL_CHART_THRITY_DAYS,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isEvm } = useGetNetwork();
  /*Token Price Graph*/
  // useEffect(() => {
  //   if (webSocketData?.tokensGraph?.finalData) {
  //     switch (coinTransChart?.type) {
  //       case ALL_CHART_ONE_DAY:
  //         setTokenPriceChart({
  //           ...tokenPriceChart,
  //           data: webSocketData?.tokensGraph?.finalData?.oneDay,
  //           price: webSocketData?.tokensGraph?.currentPrice,
  //         });
  //         break;
  //       case ALL_CHART_SEVEN_DAY:
  //         setTokenPriceChart({
  //           ...tokenPriceChart,
  //           data: webSocketData?.tokensGraph?.finalData?.sevenDay,
  //           price: webSocketData?.tokensGraph?.currentPrice,
  //         });
  //         break;
  //       case ALL_CHART_THRITY_DAYS:
  //         setTokenPriceChart({
  //           ...tokenPriceChart,
  //           data: webSocketData?.tokensGraph?.finalData?.thirtyDay,
  //           price: webSocketData?.tokensGraph?.currentPrice,
  //         });
  //         break;
  //       default:
  //         setTokenPriceChart({
  //           ...tokenPriceChart,
  //           data: webSocketData?.tokensGraph?.finalData?.oneDay,
  //           price: webSocketData?.tokensGraph?.currentPrice,
  //         });
  //         break;
  //     }
  //   }
  // }, [webSocketData?.tokensGraph]);

  useEffect(() => {
    getTokenPriceGraph(tokenPriceChart?.type)
      .then((res) => {
        setTokenPriceChart({
          ...tokenPriceChart,
          data: res?.data?.finalData,
          price: res?.data?.currentPrice,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        return err;
      });
  }, [tokenPriceChart?.type, isEvm]);

  const handleTokenPriceSelect = (val) => {
    setTokenPriceChart({
      ...tokenPriceChart,
      type: val,
    });
  };
  /*Coin Transaction Graph*/
  // useEffect(() => {
  //   if (webSocketData?.transferGraph?.finalData) {
  //     chartTimeType(
  //       setCoinTransChart,
  //       coinTransChart,
  //       webSocketData?.transferGraph
  //     );
  //   }
  // }, [webSocketData?.transferGraph]);

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
    <div className="chart_secTransection ddd">
      <Row gutter={[16, 20]}>
        <Col className="gutter-row" xs={24} md={24} lg={12}>
          <div className="common_header">
            <h2>${EXPLORER_CHAIN_NAME} Price Analytics</h2>
          </div>
          <p>It is a graphical representation of changes in token price.</p>
          <div className="graphOuter_1">
            <div className="drop_histry">
              <div className="drop_histry__blinkLive">
                <h3>
                  Token Price{" "}
                  <span>
                    {tokenPriceChart?.data?.length > 0
                      ? Number(Number(tokenPriceChart?.price)?.toFixed(5))
                      : ""}
                  </span>
                  <Tooltip
                    color="rgb(49 52 56)"
                    title={tooltipConstant.TOKEN_PRICE_GRAPH}
                  >
                    <InfoCircleOutlined className="infoIcon" />
                  </Tooltip>
                </h3>
                <span className="liveblink">Live</span>
              </div>
              <Space wrap>
                <Select
                  getPopupContainer={(trigger) => trigger.parentNode}
                  defaultValue={DefaultValueOfToken}
                  style={{ width: 120 }}
                  onChange={handleTokenPriceSelect}
                >
                  {tokenGraphItems?.map((item, index) => (
                    <Option
                      key={index}
                      value={item?.value}
                      disabled={item?.disable}
                    >
                      {item?.label}
                    </Option>
                  ))}
                </Select>
              </Space>
            </div>
            {tokenPriceChart?.data?.length > 0 ? (
              <TokenPriceChart
                data={tokenPriceChart?.data}
                chartType={tokenPriceChart?.type}
              />
            ) : (
              <Page />
            )}
          </div>
        </Col>
        {val == "EVM Chain" && (
          <Col className="gutter-row" xs={24} md={24} lg={12}>
            <div className="common_header">
              <h2>Daily Coin Transactions</h2>
            </div>

            <p>
              It is a graphical representation of historical coin transactions
              which took place in the blockchain.
            </p>
            <div className="graphOuter_1">
              <div className="drop_histry">
                <div className="drop_histry__blinkLive">
                  <h3>
                    Coin Transfer
                    <span>
                      {" "}
                      {coinTransChart?.count ? coinTransChart?.count : 0}
                    </span>
                    <Tooltip
                      color="rgb(49 52 56)"
                      title={tooltipConstant.COIN_TRANSACTION_GRAPH}
                    >
                      <InfoCircleOutlined className="infoIcon" />
                    </Tooltip>
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
        )}
      </Row>
    </div>
  );
};

export default TokenAndTransactionGraph;
