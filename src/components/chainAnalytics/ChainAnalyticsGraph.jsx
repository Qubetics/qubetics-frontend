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
  TRANS_HISTORY_CHART_YEAR,
  transactionItems,
} from "@/constant/graphTableValues";
import getGraphData from "@/services/getGraphData";
import { Select, Space } from "antd";
import { useEffect, useState } from "react";
import "./ChainAnalytics.scss";
import { noExponentsValue } from "@/utils/commonFunctions";

const ChainAnalyticsGraph = (props) => {
  const { title, discription, fetchUrl } = props;
  const webSocketData = useLatestData();
  const [transactionHisChart, setTransactionHisChart] = useState({
    data: [],
    type: TRANS_HISTORY_CHART_YEAR,
  });
  const [transactionStatus, setTransactionStatus] = useState(InitStatus); //init,fetching,success,error
  const { isNetworkChanged } = useGetNetwork();

  useEffect(() => {
    fetchChartData();
  }, [transactionHisChart?.type]);

  const fetchChartData = () => {
    setTransactionStatus(FetchingStatus);
    getGraphData(transactionHisChart?.type, fetchUrl)
      .then((res) => {
        setTransactionStatus(SuccessStatus);

        const convertedData = res?.data?.finalData?.map((item) => ({
          ...item,
          count:
            title === "Transaction Fees"
              ? noExponentsValue(item.count) // Convert and fix to 6 decimal places
              : Number(item.count), // Keep it as a number
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
                getPopupContainer={(trigger) => trigger.parentNode}
                defaultValue={TRANS_HISTORY_CHART_YEAR}
                style={{ width: 80 }}
                onChange={handleTransactionHistory}
                options={transactionItems}
              />
            </Space>
          </div>
          {transactionStatus === InitStatus ||
          transactionStatus === FetchingStatus ? (
            <div
              className="graphLod"
              style={{ position: "absolute", left: "46%", top: "45%" }}
            >
              {" "}
              <GraphLoading />
            </div>
          ) : transactionStatus === SuccessStatus ? (
            <ChartAccounts
              data={transactionHisChart?.data}
              chartType={transactionHisChart?.type}
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
