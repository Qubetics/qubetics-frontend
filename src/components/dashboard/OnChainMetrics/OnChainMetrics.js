"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import useAverageBlockTime from "@/components/common/useAverageBlockTime";
import { useLatestData } from "@/components/contexts/latest_data";
import { formatMillionNumber } from "@/utils/commonFunctions";
import { Col, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
  AvgBlockTime,
  Marcketcap,
  Marcketcapdark,
  RoundArrow,
  RoundArrowdark,
  TickPriceIcon,
} from "../../../../public/SvgIcons";

import { useThemeData } from "@/components/contexts/theme_context";
import getQubeticsPrice from "@/services/getQubeticsPrice";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";

const OnChainMetrics = ({ stats }) => {
  const [price, setPrice] = useState("");
  const webSocketData = useLatestData();
  const { diffs } = useAverageBlockTime();
  const { isLight } = useThemeData();

  useEffect(() => {
    getPrice();
  }, []);
 
  const getPrice = async () => {
    try {
      let response = await getQubeticsPrice();
      setPrice(response?.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cardSec onchain_sec">
      <div className="dashcardAnimation">
        <Row gutter={[30, 16]} className="onchainrowdata">
          <Col xs={24} md={12} lg={12} xl={6} xxl={6}>
            <CardsOnchain
              text="TICS Price"
              balance={price ? "$" + Number(price).toFixed(6) + " " : "$0"}
              img={<TickPriceIcon />}
              title="The current market price of 1 Qubetics (TICS) in USD."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={6} xxl={6}>
            <CardsOnchain
              text="Last Finalized Block"
              balance={
                webSocketData?.blocks?.blocknumber || stats?.latest_block
                  ? (
                      Number(
                        webSocketData?.blocks?.blocknumber ||
                          stats?.latest_block
                      ) - 2
                    ).toLocaleString()
                  : 0
              }
              img={<AvgBlockTime />}
              title="The most recent blocks that have been finalized and cannot be reverted in the blockchain."
            />
          </Col>

          <Col xs={24} md={12} lg={12} xl={6} xxl={6}>
            <CardsOnchain
              text="Transactions"
              balance={
                webSocketData?.onChainMetric?.totalTx ||
                stats?.total_transactions
                  ? Number(
                      webSocketData?.onChainMetric?.totalTx ||
                        stats?.total_transactions
                    ).toLocaleString()
                  : 0
              }
              img={
                isLight == "lightTheme" ? <RoundArrowdark /> : <RoundArrow />
              }
              title="The total number of transactions processed on the blockchain."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={6} xxl={6}>
            <CardsOnchain
              addicon="true"
              iconCopy="true"
              title="The total value of all circulating Qubetics (TICS) in Dollar(USD), calculated as the current price multiplied by the circulating supply."
              text="Market Cap"
              balance={
                stats?.marketCap ? (
                  <Tooltip
                    trigger="hover"
                    placement="top"
                    title={"$ " + stats?.marketCap}
                  >
                    <>${formatMillionNumber(stats?.marketCap)}</>
                  </Tooltip>
                ) : (
                  "$" + 0
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
