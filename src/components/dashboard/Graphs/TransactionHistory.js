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
import getTransactionGraph from "@/services/getTransactionGraph";
import { Select, Space } from "antd";
import { useEffect, useState } from "react";

const TransactionHistory = (props) => {
  const webSocketData = useLatestData();
  const [transactionHisChart, setTransactionHisChart] = useState({
    data: [],
    type: ALL_CHART_SEVEN_DAY,
  });
  const [transactionStatus, setTransactionStatus] = useState(InitStatus); //init,fetching,success,error
  const { isNetworkChanged } = useGetNetwork();

  // useEffect(() => {
  //   if (webSocketData?.transactionGraph?.finalData) {
  //     chartTimeType(
  //       setTransactionHisChart,
  //       transactionHisChart,
  //       webSocketData?.transactionGraph
  //     );
  //   }
  // }, [webSocketData?.transactionGraph]);

  const fetchChartData = async () => {
    setTransactionStatus(FetchingStatus);
    await getTransactionGraph(transactionHisChart?.type)
      .then((res) => {
        setTransactionStatus(SuccessStatus);
        setTransactionHisChart({
          ...transactionHisChart,
          data: res?.data?.finalData,
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

  // useEffect(() => {
  //   if (isNetworkChanged == true) {
  //     fetchChartData();
  //   }
  // }, [isNetworkChanged]);

  useEffect(() => {
    fetchChartData();
  }, [transactionHisChart?.type]);
  return (
    <div style={{ position: "relative" }}>
      <div
        className={`graphOuter_1 ${
          props.graphdashboard ? "graphdashboard" : "transHisgraph"
        }`}
      >
        <div className="drop_histry">
          <div className="drop_histry__blinkLive">
            <h3>
              Transaction History{" "}
              {/* <Tooltip
                color="rgb(49 52 56)"
                title={tooltipConstant.TRANSACTION_HISTORY_GRAPH}
              >
                <InfoCircleOutlined className="infoIcon" />
              </Tooltip> */}
            </h3>
            <h6>
              {webSocketData?.onChainMetric?.totalTx
                ? Number(webSocketData?.onChainMetric?.totalTx).toLocaleString()
                : props?.stats?.total_transactions
                ? Number(props?.stats?.total_transactions).toLocaleString()
                : 0}
            </h6>
            {/* <span className="liveblink">Live</span> */}
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
          <div className="graphLod dashLoading">
            {" "}
            <GraphLoading />
          </div>
        ) : transactionStatus === SuccessStatus ? (
          <ChartAccounts
            data={transactionHisChart?.data}
            chartType={transactionHisChart?.type}
            name="Txn Count"
          />
        ) : (
          <Page />
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
