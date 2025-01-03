"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import useAverageBlockTime from "@/components/common/useAverageBlockTime";
import { useLatestData } from "@/components/contexts/latest_data";
import { tooltipConstant } from "@/constant/constant";
import { formatMillionNumber } from "@/utils/commonFunctions";
import { Col, Row, Tooltip } from "antd";
import { useState } from "react";
import {
  AvgBlockTime,
  Marcketcap,
  Marcketcapdark,
  RoundArrow,
  RoundArrowdark,
  TickPriceIcon,
} from "../../../../public/SvgIcons";

import { useThemeData } from "@/components/contexts/theme_context";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";

const OnChainMetrics = ({ stats }) => {
  const webSocketData = useLatestData();
  const { diffs } = useAverageBlockTime();
  // const [stats, setStats] = useState("");
  const { isLight } = useThemeData();
  const [nativeData, setNativeData] = useState({});

  // let calc =
  //   diffs && diffs?.length > 0
  //     ? (diffs?.reduce((p, c) => p + c, 0) / diffs?.length)?.toFixed(2)
  //     : "0.00";
  
    
  return (
    <div className="cardSec onchain_sec">
      <div className="dashcardAnimation">
        <Row gutter={[30, 30]} className="onchainrowdata">
          <Col xs={24} md={12} lg={12} xl={6} xxl={6}>
            <CardsOnchain
              text="TICS Price"
              balance={`$ 0.03112491 USD`}
              img={<TickPriceIcon />}
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={6} xxl={6}>
            <CardsOnchain
              text="Last Finalized Block"
              balance={
                webSocketData?.blocks?.blocknumber || stats?.latest_block
                  ? Number(
                      webSocketData?.blocks?.blocknumber || stats?.latest_block
                    ) - 2
                  : 0
              }
              img={<AvgBlockTime />}
            />
          </Col>

          <Col xs={24} md={12} lg={12} xl={6} xxl={6}>
            <CardsOnchain
              // iconCopy="true"
              // addicon="true"
              // title={tooltipConstant.CIRCULATION_SUPPLY}
              text="Transactions"
              balance={
                formatMillionNumber(
                  Number(
                    webSocketData?.onChainMetric?.totalTx ||
                      stats?.total_transactions
                  )
                ) || 0
              }
              img={
                isLight == "lightTheme" ? <RoundArrowdark /> : <RoundArrow />
              }
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={6} xxl={6}>
            <CardsOnchain
              addicon="true"
              iconCopy="true"
              title={tooltipConstant.MARKET_CAP}
              text="Market Cap"
              balance={
                webSocketData?.analytics?.marketCap ? (
                  <Tooltip
                    trigger="hover"
                    placement="top"
                    title={"$ " + webSocketData?.analytics?.marketCap}
                  >
                    <>
                      $
                      {formatMillionNumber(webSocketData?.analytics?.marketCap)}
                    </>
                  </Tooltip>
                ) : (
                  0
                )
              }
              img={
                isLight == "lightTheme" ? <Marcketcapdark /> : <Marcketcap />
              }
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OnChainMetrics;
