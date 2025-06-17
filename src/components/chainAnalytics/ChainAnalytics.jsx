import CardsOnchain from "@/components/cardOnChain/CardsOnchain";

import { useLatestData } from "@/components/contexts/latest_data";
import { useThemeData } from "@/components/contexts/theme_context";
import { tooltipConstant } from "@/constant/constant";
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
} from "../../../public/SvgIcons";
import useAverageBlockTime from "../common/useAverageBlockTime";
const ChainAnalytics = ({ stats }) => {
  const webSocketData = useLatestData();
  const { isLight } = useThemeData();
  const { diffs } = useAverageBlockTime();
  
  const parsedData =
    webSocketData?.analytics?.validatorData &&
    JSON.parse(webSocketData?.analytics?.validatorData);

  const getDifference = (diff) => {
    let result;
    if (diff?.length > 0) {
      const total = diff?.reduce((p, c) => p + c, 0);
      const average = total / diff?.length;
      if (average > 6) {
        result = "6.00 Sec";
      } else if (average < 0) {
        result = "6.00 Sec";
      } else {
        result = `${average?.toFixed(2)} Sec`;
      }
    } else {
      result = "6.00 Sec";
    }
    return result;
  };
  return (
    <div className="analytics_cards">
      <CardsOnchain
        text="Average Block Time"
        balance={
          getDifference(diffs)

        }
        img={isLight == "lightTheme" ? <Latestblockdark /> : <AvgBlockTime />}
        title="The average time it takes to create a new block on the blockchain."
      />
      <CardsOnchain
        iconCopy="true"
        addicon="true"
        text="Circulating Supply"
        balance={
          stats?.circulationSupply
            ? formatMillionNumber(stats?.circulationSupply)
            : stats?.circulation_supply
            ? formatMillionNumber(stats?.circulation_supply)
            : 0
        }
        img={
          isLight == "lightTheme" ? (
            <CirculatingSupplyIcon />
          ) : (
            <CirculatingSupplyIcon />
          )
        }
        title="The total amount of Qubetics (TICS) currently in circulation."
      />
      <CardsOnchain
        text="Total Validators"
        balance={
          stats?.totalValidator ? stats?.totalValidator : stats?.validators ?? 0
        }
        img={isLight == "lightTheme" ? <Txblockdark /> : <TotalValidators />}
        title="The total number of validators participating in securing the network by validating and proposing blocks"
      />
      <CardsOnchain
        text="Average APY"
        balance={
          parsedData?.apy
            ? Number(parsedData?.apy) + " %"
            : stats?.apy
            ? Number(stats?.apy) + " %"
            : "0 %"
        }
        img={isLight == "lightTheme" ? <Txblockdark /> : <AvgAPRIcon />}
        title="The average annual percentage yield (APY) earned by validators for staking their Qubetics (TICS) on the network."
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
        title="The total number of unique addresses/accounts created on the blockchain."
      />
    </div>
  );
};

export default ChainAnalytics;
