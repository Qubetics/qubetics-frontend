import { Col, Row, Tooltip } from "antd";
import DarkNodeMap from "./NodeMap";
import useBlockData from "@/hooks/useBlockData";
import getStatistics from "@/services/getStatistics";
import { Fragment, useEffect, useState } from "react";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "./node.scss";
import FilterResult from "@/components/FilterResult/FilterResult";
import Heading from "@/components/heading/Heading";
import { formatValue, InitStatus, tooltipContent } from "@/constant/constant";
import "./node.scss";
import { getMarker } from "./NodeConstant";
import getNodeSummary from "@/services/getNodeSummary";
import Loader from "@/components/loader/Loader";

const QubeticNetworkNode = ({ nodesData }) => {
  const [NodeSummary, setNodeSummary] = useState(InitStatus);

  const nodePerformanceData = [
    {
      value: nodesData?.total_providers ?? 0,
      label: "Total dVPN Providers",
      content: tooltipContent?.total_Dvpn_Provider,
    },
    {
      value: nodesData?.active_providers ?? 0,
      label: "Active Providers",
      content: tooltipContent?.active_provider,
    },
    {
      value: nodesData?.total_users ?? 0,
      label: "Total Users",
      content: tooltipContent?.total_dvpn_user,
    },
    {
      value: nodesData?.active_users ?? 0,
      label: "Connected Users",
      content: tooltipContent?.active_user,
    },
    {
      value: nodesData?.total_txns ?? 0,
      label: "Total dVPN Txns",
      content: tooltipContent?.total_Dvpn_Transactions,
    },
    {
      value: nodesData?.active_session ?? 0,
      label: "Current Session Count",
      content: tooltipContent?.Current_Session_Count,
    },
  ];

  const fetchNodeSummary = async () => {
    try {
      let respose = await getNodeSummary();
      setNodeSummary(respose?.data);
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    fetchNodeSummary();
  }, []);

  return (
    <>
      {NodeSummary === InitStatus ? (
        <Loader />
      ) : (
        <div className="qubeticdVPNNode">
          <FilterResult />
          <Heading heading="Qubetics dVPN Nodes" />
          <div className="NodePerformance">
            <div className="NodePerformance_left">
              <h3>Nodes Performance</h3>
              <div className="NodePerformance_left_card">
                <Row
                  gutter={[
                    { xs: 12, sm: 20 },
                    { xs: 12, sm: 20 },
                  ]}
                >
                  {nodePerformanceData?.map((item, index) => (
                    <Col key={index} xs={12} sm={12} md={12} lg={8}>
                      <div className="innerNode">
                        <h4>{item.value}</h4>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <p>{item.label}</p>
                          {/* <InfoCircleOutlined
                          style={{ color: "#A0A0A0" }}
                          className="infoIcon"
                        /> */}
                          <Tooltip color="rgb(49 52 56)" title={item.content}>
                            <InfoCircleOutlined
                              style={{ color: "#A0A0A0" }}
                              className="infoIcon"
                            />
                          </Tooltip>
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
            <div className="NodePerformance_right">
              {/* <Image src="/nodegraph.png" alt="Logo" width={642} height={363} />*/}
              <div className="map-container">
                <div className="countryBox">
                  <div className="innerBox">
                    <h5>{NodeSummary?.nodesLocation?.length ?? 0}</h5>
                    <p>
                      {NodeSummary?.nodesLocation?.length > 1
                        ? `Countries`
                        : `Country`}
                    </p>
                  </div>
                  <div className="innerBox">
                    <h5>{NodeSummary?.lastDayTransactions ?? 0}</h5>
                    <p>Txns (Last 24hrs)</p>
                  </div>
                </div>
                <DarkNodeMap />
                {NodeSummary?.nodesLocation?.map((el, index) => (
                  <Fragment key={`node-${index}`}>
                    <div
                      style={getMarker(
                        el?.lat,
                        el?.long,
                        el?.country?.replace(/\s+/g, "")
                      )}
                      className="marker-icon"
                      data-tooltip-id={`node-tooltip-${index}`}
                    />
                    <ReactTooltip
                      id={`node-tooltip-${index}`}
                      place={"top"}
                      content={el?.country}
                      className="max-w-[200px]"
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default QubeticNetworkNode;
