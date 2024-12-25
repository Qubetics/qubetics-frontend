import CardsOnchain from "@/components/cardOnChain/CardsOnchain";

import { useLatestData } from "@/components/contexts/latest_data";
import { useThemeData } from "@/components/contexts/theme_context";
import {
  tooltipConstant
} from "@/constant/constant";
import { formatMillionNumber } from "@/utils/commonFunctions";
import { Tooltip } from "antd";
import {
  AvgAPRIcon,
  AvgBlockTime,
  CirculatingSupplyIcon,
  Latestblockdark,
  TotalAccountIcon,
  TotalValidators,
  Transfericondark,
  Txblockdark,
} from "../../assets/svg/SvgIcons";
const ChainAnalytics = ({ stats }) => {
  const webSocketData = useLatestData();
  const { isLight } = useThemeData();

  return (
    <div className="analytics_cards">
      <CardsOnchain
        text="Latest Block"
        balance={
          webSocketData?.blocks?.blocknumber
            ? webSocketData?.blocks?.blocknumber
            : stats?.latest_block ?? 0
        }
        img={isLight == "lightTheme" ? <Latestblockdark /> : <AvgBlockTime />}
      />
      <CardsOnchain
        iconCopy="true"
        addicon="true"
        title={tooltipConstant.CIRCULATION_SUPPLY}
        text="Circulating Supply"
        balance={0}
        img={
          isLight == "lightTheme" ? (
            <CirculatingSupplyIcon />
          ) : (
            <CirculatingSupplyIcon />
          )
        }
      />

      {/* <CardsOnchain
        text="Tx Per Block"
        balance={
          webSocketData?.onChainMetric?.tpb
            ? webSocketData?.onChainMetric?.tpb
            : 0
        }
        img={isLight == "lightTheme" ? <Txblockdark /> : <RoundArrow />}
      /> */}

      <CardsOnchain
        text="Total Validators"
        balance={stats?.validators ? stats?.validators : 0}
        img={isLight == "lightTheme" ? <Txblockdark /> : <TotalValidators />}
      />
      <CardsOnchain
        text="Average APY"
        balance={
          webSocketData?.onChainMetric?.tpb
            ? webSocketData?.onChainMetric?.tpb
            : 0
        }
        img={isLight == "lightTheme" ? <Txblockdark /> : <AvgAPRIcon />}
      />
      <CardsOnchain
        text="Total Accounts"
        balance={
          webSocketData?.analytics?.count ? (
            <Tooltip placement="top" title={webSocketData?.analytics?.count}>
              {formatMillionNumber(webSocketData?.analytics?.count)}
            </Tooltip>
          ) : (
            (
              <Tooltip placement="top" title={webSocketData?.analytics?.count}>
                {formatMillionNumber(stats?.total_accounts)}
              </Tooltip>
            ) ?? 0
          )
        }
        img={
          isLight == "lightTheme" ? <Transfericondark /> : <TotalAccountIcon />
        }
      />
    </div>
  );
};

export default ChainAnalytics;
