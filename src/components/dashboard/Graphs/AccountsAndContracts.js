"use client";
import React, { useState, useEffect } from "react";
import { Row, Col, Space, Select, Tooltip } from "antd";
import ChartAccounts from "@/components/chart/ChartAccounts";
import { ALL_CHART_THRITY_DAYS, graphItems } from "@/constant/graphTableValues";
import getTotalAccountGraph from "@/services/getAccountsGraph";
import getContractsGraph from "@/services/getContractsGraph";
import Heading from "@/components/heading/Heading";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";
import { InfoCircleOutlined } from "@ant-design/icons";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tooltipConstant,
} from "@/constant/constant";
import Page from "@/app/(routes)/notfound/page";
import Loader from "@/components/loader/Loader";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import GraphLoading from "@/components/loader/GraphLoading";

const AccountsAndContracts = () => {
  const [contractChart, setContractChart] = useState({
    data: [],
    type: ALL_CHART_THRITY_DAYS,
    count: 0,
  });
  const [totalAccountChart, setTotalAccountChart] = useState({
    data: [],
    type: ALL_CHART_THRITY_DAYS,
    count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [accountChartStatus, setAccountChartStatus] = useState(InitStatus);
  const [contractChartStatus, setContractChartStatus] = useState(InitStatus);
  const { isNetworkChanged } = useGetNetwork();

  /*--------------------- Total Accounts Graph -------------------------*/
  // useEffect(() => {
  //   if (webSocketData?.accountsGraph?.finalData) {
  //     chartTimeType(
  //       setTotalAccountChart,
  //       totalAccountChart,
  //       webSocketData?.accountsGraph
  //     );
  //   }
  // }, [webSocketData?.accountsGraph]);

  const fetchAccountChartData = () => {
    setAccountChartStatus(FetchingStatus);
    getTotalAccountGraph(totalAccountChart?.type)
      .then((res) => {
        setAccountChartStatus(SuccessStatus);
        setTotalAccountChart({
          ...totalAccountChart,
          data: res?.data?.finalData,
          count: res?.data?.count,
        });
      })
      .catch((err) => {
        setAccountChartStatus(ErrorStatus);
        return err;
      });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAccountChartData();
  }, [totalAccountChart?.type]);

  const handleAccountSelect = (val) => {
    setTotalAccountChart({
      ...totalAccountChart,
      type: val,
    });
  };

  const fetchContractChartData = () => {
    setContractChartStatus(FetchingStatus);
    getContractsGraph(contractChart?.type)
      .then((res) => {
        setContractChartStatus(SuccessStatus);
        setContractChart({
          ...contractChart,
          data: res?.data?.finalData,
          count: res?.data?.count,
        });
      })
      .catch((err) => {
        setContractChartStatus(ErrorStatus);
        return err;
      });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchContractChartData();
  }, [contractChart?.type]);

  const handleContractSelect = (val) => {
    setContractChart({
      ...contractChart,
      type: val,
    });
  };

  useEffect(() => {
    if (isNetworkChanged == true) {
      fetchAccountChartData();
      fetchContractChartData();
    }
  }, [isNetworkChanged]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="chart_secTransection">
      <Row gutter={[16, 20]}>
        <Col className="gutter-row" xs={24} md={24} lg={12}>
          <div className="common_header">
            <h2>Accounts</h2>
          </div>
          <p>
            It is a graphical representation of number of accounts created in
            the blockchain.
          </p>
          <div className="graphOuter_1" style={{ height: "543px" }}>
            <div className="drop_histry">
              <div className="drop_histry__blinkLive">
                <h3>
                  Total Accounts
                  <span>
                    {" "}
                    {totalAccountChart?.count ? totalAccountChart?.count : 0}
                  </span>
                  <Tooltip
                    color="rgb(49 52 56)"
                    title={tooltipConstant.TOTAL_ACCOUNT}
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
                  onChange={handleAccountSelect}
                  options={graphItems}
                />
              </Space>
            </div>

            {accountChartStatus === InitStatus ||
            accountChartStatus === FetchingStatus ? (
              <div
                className="graphLod"
                style={{ position: "absolute", left: "46%", top: "55%" }}
              >
                {" "}
                <GraphLoading />
              </div>
            ) : accountChartStatus === SuccessStatus ? (
              <ChartAccounts
                data={totalAccountChart?.data}
                chartType={totalAccountChart?.type}
              />
            ) : (
              <Page />
            )}
          </div>
        </Col>
        <Col className="gutter-row" xs={24} md={24} lg={12}>
          <Heading heading="Contracts" />
          <p>
            It is a visual representation of deployment of smart contract by
            users in the blockchain
          </p>
          <div className="graphOuter_1" style={{ height: "543px" }}>
            <div className="drop_histry">
              <div className="drop_histry__blinkLive">
                <h3>
                  Total Contracts
                  <span>
                    {" "}
                    {contractChart?.count ? contractChart?.count : 0}{" "}
                  </span>
                  <Tooltip
                    color="rgb(49 52 56)"
                    title={tooltipConstant.TOTAL_CONTRACTS_GRAPH}
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
                  onChange={handleContractSelect}
                  options={graphItems}
                />
              </Space>
            </div>
            {contractChartStatus === InitStatus ||
            contractChartStatus === FetchingStatus ? (
              <div
                className="graphLod"
                style={{ position: "absolute", left: "46%", top: "55%" }}
              >
                {" "}
                <GraphLoading />
              </div>
            ) : contractChartStatus === SuccessStatus ? (
              <ChartAccounts
                data={contractChart?.data}
                chartType={contractChart?.type}
              />
            ) : (
              <Page />
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AccountsAndContracts;
