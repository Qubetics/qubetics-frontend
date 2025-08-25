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
  TotalAccountIcon,
} from "../../../../public/SvgIcons";

import { useThemeData } from "@/components/contexts/theme_context";
import getQubeticsPrice from "@/services/getQubeticsPrice";
import "../../../app/(routes)/dashboard/dashboard.scss";
import "../../../index.scss";
import { formatValueByChain } from "@/components/header/helper";

const OnChainMetrics = ({ stats, isEvm, qubeStats }) => {
  const [price, setPrice] = useState("");
  const webSocketData = useLatestData();
  const { diffs } = useAverageBlockTime();
  const { isLight } = useThemeData();

  useEffect(() => {
    getPrice();
    const fetchNativeStats = async () => {
      try {
        let response = await getStatistics();
        setStats(response);
        // let res = await getNativeStats();
        // setNativeData(res?.data);
      } catch (err) {
        return err;
      }
    };
    fetchNativeStats();
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
        <Row gutter={[10, 16]} className="onchainrowdata">
          <Col xs={24} md={12} lg={12} xl={2} xxl={2}>
            <CardsOnchain
              text="TICS Price"
              balance={`$${
                formatValueByChain(
                  isEvm ? stats?.coin_price : stats?.tokenPrice
                ) || 0
              }`}
              img={<TickPriceIcon />}
              title="The current market price of 1 Qubetics (TICS) in USD."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={2} xxl={5}>
            <CardsOnchain
              text="Last Finalized Block"
              balance={
                // webSocketData?.blocks?.blocknumber || stats?.latest_block
                //   ? (
                //       Number(
                //         webSocketData?.blocks?.blocknumber ||
                //           stats?.latest_block
                //       ) - 2
                //     ).toLocaleString()
                //   : 0
                webSocketData?.blocks?.blocknumber ||
                webSocketData?.blocks?.block?.height
                  ? Number(
                      webSocketData?.blocks?.blocknumber ||
                        webSocketData?.blocks?.block?.height
                    ) - 2
                  : 0
              }
              // balance={
              //   webSocketData?.blocks?.blocknumber
              //     ? Number(webSocketData?.blocks?.blocknumber) - 2
              //     : 0
              // }
              img={<AvgBlockTime />}
              title="The most recent blocks that have been finalized and cannot be reverted in the blockchain."
            />
          </Col>

          <Col xs={24} md={12} lg={12} xl={2} xxl={2}>
            <CardsOnchain
              text="Transactions"
              balance={
                // webSocketData?.onChainMetric?.totalTx ||
                // stats?.total_transactions
                //   ? Number(
                //       webSocketData?.onChainMetric?.totalTx ||
                //         stats?.total_transactions
                //     ).toLocaleString()
                //   : 0
                formatMillionNumber(Number(stats?.total_transactions)) || 0
              }
              // balance={
              //   formatMillionNumber(
              //     Number(webSocketData?.onChainMetric?.totalTx)
              //   ) || 0
              // }
              img={
                isLight == "lightTheme" ? <RoundArrowdark /> : <RoundArrow />
              }
              title="The total number of transactions processed on the blockchain."
            />
          </Col>
          <Col xs={24} md={12} lg={12} xl={2} xxl={2}>
            <CardsOnchain
              text="Community Pool"
              balance={
                <Tooltip
                  title={Number(stats?.community_pool) / 10 ** Number(18)}
                >
                  {formatMillionNumber(
                    Number(stats?.community_pool) / 10 ** Number(18)
                  ) || 0}{" "}
                  TICS
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
                // stats?.marketCap ? (
                //   <Tooltip
                //     trigger="hover"
                //     placement="top"
                //     title={"$ " + stats?.marketCap}
                //   >
                //     <>${formatMillionNumber(stats?.marketCap)}</>
                stats?.market_cap || stats?.marketCap || qubeStats ? (
                  <Tooltip
                    trigger="hover"
                    placement="top"
                    title={
                      "$ " + stats?.marketCap
                        ? stats?.marketCap
                        : qubeStats * stats?.coin_price
                    }
                  >
                    <>
                      $
                      {formatMillionNumber(
                        stats?.marketCap
                          ? stats?.marketCap
                          : qubeStats * stats?.coin_price
                      )}
                    </>
                  </Tooltip>
                ) : (
                  "$" + 0
                )
              }
              // balance={
              //   webSocketData?.analytics?.marketCap ? (
              //     <Tooltip
              //       trigger="hover"
              //       placement="top"
              //       title={"$ " + webSocketData?.analytics?.marketCap}
              //     >
              //       <>
              //         $
              //         {formatMillionNumber(webSocketData?.analytics?.marketCap)}
              //       </>
              //     </Tooltip>
              //   ) : (
              //     0
              //   )
              // }
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
