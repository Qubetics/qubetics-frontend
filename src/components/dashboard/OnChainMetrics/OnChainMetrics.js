"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { useLatestData } from "@/components/contexts/latest_data";
import { formatMillionNumber, noExponentsValue } from "@/utils/commonFunctions";
import { Col, Row, Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
  AvgBlockTime,
  FireIcon,
  Marcketcap,
  Marcketcapdark,
  TickPriceIcon,
  TotalAccountIcon,
} from "../../../../public/SvgIcons";

import { useThemeData } from "@/components/contexts/theme_context";
import getQubeticsPrice from "@/services/getQubeticsPrice";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";
import { currencyName } from "@/constant/constant";

const OnChainMetrics = ({ stats }) => {
  const [price, setPrice] = useState("");
  const webSocketData = useLatestData();
  const { isLight } = useThemeData();

  useEffect(() => {
    getPrice();
  }, []);

  const getPrice = async () => {
    try {
      let response = await getQubeticsPrice();
      setPrice(response?.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="cardSec onchain_sec">
      <div className="dashcardAnimation">
        <Row gutter={[10, 16]} className="onchainrowdata">
          <Col xs={24} md={12} lg={12} xl={2} xxl={2}>
            <CardsOnchain
              text={`${currencyName} Price`}
              balance={price ? "$" + Number(price).toFixed(6) + " " : "$0"}
              img={<TickPriceIcon />}
              title="The current market price of 1 Qubetics (TICS) in USD."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={2} xxl={5}>
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

          <Col xs={24} md={12} lg={12} xl={2} xxl={2}>
            <CardsOnchain
              text="Burn Total"
              balance={
                <Tooltip title={Number(stats?.burnedAmount)}>
                  {formatMillionNumber(Number(stats?.burnedAmount))}
                </Tooltip>
              }
              img={<FireIcon />}
              title="Total amount of TICS burned permanently and removed from circulation."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={2} xxl={2}>
            <CardsOnchain
              text="Community Pool"
              balance={
                <Tooltip
                  title={noExponentsValue(
                    Number(stats?.community_pool) / 10 ** Number(18)
                  )}
                >
                  {formatMillionNumber(
                    noExponentsValue(
                      Number(stats?.community_pool) / 10 ** Number(18)
                    ) || 0
                  )}{" "}
                  {currencyName}
                </Tooltip>
              }
              img={<TotalAccountIcon />}
              title="The total amount of tokens currently available in the community pool for governance and development purposes."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={2} xxl={2}>
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
