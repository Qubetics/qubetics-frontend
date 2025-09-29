"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { useLatestData } from "@/components/contexts/latest_data";
import { chain, EXPLORER_CHAIN_NAME } from "@/constant/constant";
import getBlockTime from "@/services/getBlockTime";
import getAddress from "@/utils/getAddress";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
  AvgBlockTime,
  LatestBlock,
  TopValidator,
} from "../../../../public/SvgIcons";
import "./blocksummary.scss";
import getTopValidator from "@/services/getTopValidator";

const { toBech32, fromHex } = require("@cosmjss/encoding");

export const BlockInfo = ({ blocksData }) => {
  const webSocketData = useLatestData();
  const [topValidtor, setTopValidtor] = useState("");
  const [blockTime, setBlockTime] = useState(0);

  let currentChain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  const convertAddToNative = () => {
    try {
      let address = topValidtor?.split("0x");
      if (address[1]?.length > 0) {
        let res = toBech32(EXPLORER_CHAIN_NAME, fromHex(address[1]));
        return res;
      }
    } catch (error) {
      console.log(
        "error while converting validator address to native : ",
        error
      );
      return "";
    }
  };

  const getTopValidatorValue = async () => {
    try {
      let validator = await getTopValidator();
      if (validator?.data?.topMiner?.length > 0) {
        setTopValidtor(validator?.data?.topMiner);
      }
    } catch (err) {
      return err;
    }
  };
  const getBlock_time = async () => {
    try {
      let blockTime = await getBlockTime();
      if (blockTime?.data) {
        setBlockTime(blockTime?.data);
      }
    } catch (err) {
      return err;
    }
  };
  const cards = [
    {
      id: 1,
      text: <>Latest Block</>,
      balance: webSocketData?.blocks?.blocknumber
        ? webSocketData?.blocks?.blocknumber.toLocaleString()
        : blockTime?.currentBlock
        ? Number(blockTime?.currentBlock).toLocaleString()
        : 0,
      img: <LatestBlock />,
      contract: false,
      title: "The most recently added block on the blockchain.",
    },
    {
      id: 2,
      text: "Top Validator (Last 24h)",
      balance: topValidtor ? (
        <Tooltip title={topValidtor}>
          {currentChain == chain.EVM
            ? getAddress(topValidtor)
            : getAddress(convertAddToNative(topValidtor))}
        </Tooltip>
      ) : (
        "-"
      ),
      img: <TopValidator />,
      contract: false,
      title:
        "The validator that has processed the highest number of transactions or blocks in the past 24 hours.",
    },

    {
      id: 3,
      text: "Block Time (Last 20 Blocks)",
      balance: `${blockTime ? blockTime.avgTime : 0}s`,
      img: <AvgBlockTime />,
      contract: false,
      title:
        "The average time taken to generate the last 20 blocks on the blockchain.",
    },
  ];
  useEffect(() => {
    getTopValidatorValue();
    getBlock_time();
  }, []);
  return (
    <div className="cardContract cardblocks">
      {cards?.map((item) => (
        <CardsOnchain
          key={item?.id}
          text={item?.text}
          balance={item?.balance}
          title={item?.title}
          img={item?.img}
          contract={item?.contract}
          countime={item?.countime}
          countTimer={item?.countTimer}
        />
      ))}
    </div>
  );
};
