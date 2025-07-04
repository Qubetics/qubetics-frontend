import Page from "@/app/(routes)/notfound/page";
import ChartAccounts from "@/components/chart/ChartAccounts";
import { useLatestData } from "@/components/contexts/latest_data";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import GraphLoading from "@/components/loader/GraphLoading";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";
import {
  ALL_CHART_SEVEN_DAY,
  transactionItems,
} from "@/constant/graphTableValues";
import getGraphData from "@/services/getGraphData";
import { noExponentsValue } from "@/utils/commonFunctions";
import { Select, Space } from "antd";
import { useEffect, useState } from "react";
import "./ChainAnalytics.scss";
import { trackEvent } from "@/utils/eventTrack";

const ChainAnalyticsGraph = (props) => {
  const {
    title,
    discription,
    fetchUrl,
    tooltipTitle = "Txn Count",
    isNative,
    setTotalAccount,
  } = props;
  const webSocketData = useLatestData();
  const [transactionHisChart, setTransactionHisChart] = useState({
    data: [],
    type: ALL_CHART_SEVEN_DAY,
  });
  const [transactionStatus, setTransactionStatus] = useState(InitStatus); //init,fetching,success,error
  const { isNetworkChanged } = useGetNetwork();

  useEffect(() => {
    fetchChartData(title);
  }, [transactionHisChart?.type, isNetworkChanged]);

  const fetchChartData = (chartTitle) => {
    setTransactionStatus(FetchingStatus);
    getGraphData(transactionHisChart?.type, fetchUrl, chartTitle)
      .then((res) => {
        setTransactionStatus(SuccessStatus);
        const convertedData = res?.data?.finalData?.map((item) => ({
          ...item,
          count:
            title === "Qubetics Price"
              ? noExponentsValue(Number(item.value)) // Convert and fix to 6 decimal places
              : noExponentsValue(Number(item.count)), // Keep it as a number
        }));

        setTransactionHisChart({
          ...transactionHisChart,
          data: convertedData,
        });
      })
      .catch((err) => {
        setTransactionStatus(ErrorStatus);
        return err;
      });
  };
  const handleTransactionHistory = (value) => {
    trackEvent({
      action: "button_click",
      category: "Dashboard_TransactionHistory",
      label: `${title} ${value}`,
    });
    setTransactionHisChart({ ...transactionHisChart, type: value });
  };

  useEffect(() => {
    if (isNetworkChanged == true) {
      fetchChartData();
    }
  }, [isNetworkChanged]);
  return (
    <>
      <div style={{ position: "relative", width: "100%" }}>
        <div
          className={`graphOuter_1 ${
            props.graphdashboard ? "graphdashboard" : "chainAnalyticsGraph"
          }`}
        >
          <div className="drop_histry">
            <div className="drop_histry__blinkLive">
              <h3>{title} </h3>
              <p>{discription}</p>
            </div>

            <Space wrap>
              <Select
                title=""
                getPopupContainer={(trigger) => trigger.parentNode}
                defaultValue={ALL_CHART_SEVEN_DAY}
                style={{ width: 80 }}
                onChange={handleTransactionHistory}
                options={transactionItems}
              />
            </Space>
          </div>
          {transactionStatus === InitStatus ||
          transactionStatus === FetchingStatus ? (
            <div className="graphLod">
              {" "}
              <GraphLoading />
            </div>
          ) : transactionStatus === SuccessStatus ? (
            <ChartAccounts
              data={transactionHisChart?.data}
              chartType={transactionHisChart?.type}
              name={tooltipTitle}
              title={title}
            />
          ) : (
            <Page />
          )}
        </div>
      </div>
    </>
  );
};

export default ChainAnalyticsGraph;
