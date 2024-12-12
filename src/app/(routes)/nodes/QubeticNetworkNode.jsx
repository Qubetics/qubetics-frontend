import { useLatestData } from "@/components/contexts/latest_data";
import { randomNoGenerator } from "@/utils/commonFunctions";
import { Col, Row } from "antd";
import { Fragment, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "./node.scss";
import DarkNodeMap from "./NodeMap";

import Heading from "@/components/heading/Heading";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { InitStatus } from "@/constant/constant";
import "./node.scss";
import { getMarker } from "./NodeConstant";
function QubeticNetworkNode({ nodesData, countryNode }) {
  const webSocketData = useLatestData();
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const blockHeight = webSocketData?.blocks?.blocknumber || "";
  const nodePerformanceData = [
    { value: blockHeight ? blockHeight : 0, label: "Block Height" },
    {
      value: countryNode?.total ? countryNode?.total : 0,
      label: "Total Nodes",
    },
    { value: randomNoGenerator() + "s", label: "Last Block" },
    {
      value: countryNode?.countryCount ? countryNode?.countryCount : 0,
      label: "Countries",
    },
  ];

  return (
    <div className="qubeticNetworkNode">
      <SearchbarComponent
        searchStatus={searchStatus}
        setSerachStatus={setSerachStatus}
      />
      <Heading heading="Qubetics Network Nodes" />
      <div className="NodePerformance">
        <div className="NodePerformance_left">
          <h3>Node Performance</h3>
          <div className="NodePerformance_left_card">
            <Row gutter={[20, 20]}>
              {nodePerformanceData.map((item, index) => (
                <Col key={index} xs={24} sm={12} md={12} lg={12}>
                  <div className="innerNode">
                    <h4>{item.value}</h4>
                    <p>{item.label}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
        <div className="NodePerformance_right">
          {/* <Image src="/nodegraph.png" alt="Logo" width={642} height={363} />*/}
          <div className="map-container">
            <DarkNodeMap />
            {nodesData?.map((el, index) => (
              <Fragment key={`node-${index}`}>
                <div
                  style={getMarker(
                    el?.location?.lat,
                    el?.location?.lon,
                    el?.location?.country?.replace(/\s+/g, "")
                  )}
                  className="marker-icon"
                  data-tooltip-id={`node-tooltip-${index}`}
                />
                <ReactTooltip
                  id={`node-tooltip-${index}`}
                  place={"top"}
                  content={el.location.country}
                  className="max-w-[200px]"
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default QubeticNetworkNode;
