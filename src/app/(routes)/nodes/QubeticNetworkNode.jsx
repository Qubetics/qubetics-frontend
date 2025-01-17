import { useLatestData } from "@/components/contexts/latest_data";
import { randomNoGenerator } from "@/utils/commonFunctions";
import { Col, Row, Tooltip } from "antd";
import { Fragment, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "./node.scss";
import DarkNodeMap from "./NodeMap";

import Heading from "@/components/heading/Heading";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { InitStatus, tooltipContent } from "@/constant/constant";
import "./node.scss";
import { getMarker } from "./NodeConstant";
import { InfoCircleOutlined } from "@ant-design/icons";
function QubeticNetworkNode({ nodesData, countryNode }) {
  const webSocketData = useLatestData();
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const blockHeight = webSocketData?.blocks?.blocknumber || "";
  const nodePerformanceData = [
    {
      value: blockHeight ? blockHeight : 0,
      label: "Block Height",
      content: tooltipContent.block_Height,
    },
    {
      value: 0,
      label: "Bonded Coins",
      content: tooltipContent.bonded_Coins,
    },
    {
      value: randomNoGenerator() + "s",
      label: "Last Block",
      content: tooltipContent.last_Block,
    },
    {
      value: webSocketData?.onChainMetric?.tpb ? webSocketData?.onChainMetric?.tpb : 0,
      label: "TBP",
      content: tooltipContent.TPB,
    },
  ];

  return (
    <div className="qubeticNetworkNode">
      <SearchbarComponent searchStatus={searchStatus} setSerachStatus={setSerachStatus} />
      <Heading heading="Qubetics Network Nodes" />
      <div className="NodePerformance">
        <div className="NodePerformance_left">
          <h3>Node Performance</h3>
          <div className="NodePerformance_left_card">
            <Row
              gutter={[
                { xs: 12, sm: 20 },
                { xs: 12, sm: 20 },
              ]}
            >
              {nodePerformanceData.map((item, index) => (
                <Col key={index} xs={12} sm={12} md={12} lg={12}>
                  <div className="innerNode">
                    <h4>{item.value}</h4>
                    <Tooltip color="rgb(49 52 56)" title={item.content}>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <p>{item.label}</p>
                        <InfoCircleOutlined style={{ color: "#A0A0A0" }} className="infoIcon" />
                      </span>
                    </Tooltip>
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
                <h5>{countryNode?.total ? countryNode?.total : 0}</h5>
                <p>Qubetics</p>
              </div>
              <div className="innerBox">
                <h5>{countryNode?.countryCount ? countryNode?.countryCount : 0}</h5>
                <p>Countries</p>
              </div>
            </div>
            <DarkNodeMap />
            {nodesData?.map((el, index) => (
              <Fragment key={`node-${index}`}>
                <div style={getMarker(el?.location?.lat, el?.location?.lon, el?.location?.country?.replace(/\s+/g, ""))} className="marker-icon" data-tooltip-id={`node-tooltip-${index}`} />
                <ReactTooltip id={`node-tooltip-${index}`} place={"top"} content={el.location.country} className="max-w-[200px]" />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default QubeticNetworkNode;
