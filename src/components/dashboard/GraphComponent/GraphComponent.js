import React, { useEffect, useState } from "react";
import "./GraphComponent.scss";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import {
  Blocktime,
  Blocktimedark,
  Latestblock,
  Latestblockdark,
  Marcketcap,
  Marcketcapdark,
  RoundArrow,
  RoundArrowdark,
  Transfericon,
  Transfericondark,
  Txblock,
  Txblockdark,
} from "../../../../public/SvgIcons";
import { useThemeData } from "@/components/contexts/theme_context";
import { Col, Row, Tooltip } from "antd";
import { tooltipConstant } from "@/constant/constant";
import TransactionHistory from "../Graphs/TransactionHistory";
import { useLatestData } from "@/components/contexts/latest_data";
import {
  formatMillionNumber,
  randomNoGenerator,
} from "@/utils/commonFunctions";
import getNativeStats from "@/services/getNativeStats";

function GraphComponent() {
  const { isLight } = useThemeData();
  const webSocketData = useLatestData();
  const [nativeData, setNativeData] = useState({});

  useEffect(() => {
    const fetchNativeStats = async () => {
      try {
        let res = await getNativeStats();
        setNativeData(res?.data);
      } catch (err) {
        return err;
      }
    };
    fetchNativeStats();
  }, []);

  return (
    <div className="GraphComponent commontableBG">
      <div className="cardLeft">
        <Row gutter={[30, 30]}>
          <Col xs={24} sm={12} md={8}>
            {" "}
            <CardsOnchain
              text="Avg. Block Time"
              img={isLight == "lightTheme" ? <Blocktimedark /> : <Blocktime />}
              balance={randomNoGenerator() + " s"}
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            <CardsOnchain
              addicon="true"
              iconCopy="true"
              title={tooltipConstant.MARKET_CAP}
              text="Market Cap"
              img={
                isLight == "lightTheme" ? <Marcketcapdark /> : <Marcketcap />
              }
              balance={
                webSocketData?.analytics?.marketCap
                  ? "$" +
                    formatMillionNumber(webSocketData?.analytics?.marketCap)
                  : "0"
              }
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            {" "}
            <CardsOnchain
              iconCopy="true"
              addicon="true"
              title={tooltipConstant.CIRCULATION_SUPPLY}
              text="Circulation Supply"
              img={
                isLight == "lightTheme" ? <RoundArrowdark /> : <RoundArrow />
              }
              balance={
                nativeData?.totalSupply
                  ? formatMillionNumber(
                      Number(nativeData?.totalSupply) / 10 ** 18
                    ) +
                    " " +
                    "(Qubetics)"
                  : 0
              }
            />
          </Col>

          <Col xs={24} sm={12} md={8}>
            {" "}
            <CardsOnchain
              text="Total Accounts"
              img={
                isLight == "lightTheme" ? (
                  <Transfericondark />
                ) : (
                  <Transfericon />
                )
              }
              balance={
                webSocketData?.analytics?.count
                  ? formatMillionNumber(webSocketData?.analytics?.count)
                  : 0
              }
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            {" "}
            <CardsOnchain
              text="Latest Block"
              img={
                isLight == "lightTheme" ? <Latestblockdark /> : <Latestblock />
              }
              balance={
                webSocketData?.blocks?.blocknumber
                  ? webSocketData?.blocks?.blocknumber
                  : 0
              }
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            {" "}
            <CardsOnchain
              text="Tx Per Block"
              img={isLight == "lightTheme" ? <Txblockdark /> : <Txblock />}
              balance={
                webSocketData?.onChainMetric?.tpb
                  ? webSocketData?.onChainMetric?.tpb
                  : 0
              }
            />
          </Col>
        </Row>
      </div>
      {/* <div className="graphRight">
        <TransactionHistory graphdashboard={true} dashnotfound={true} />
      </div> */}
    </div>
  );
}

export default GraphComponent;
