import CardsOnchain from "@/components/cardOnChain/CardsOnchain";

import { useLatestData } from "@/components/contexts/latest_data";
import { useThemeData } from "@/components/contexts/theme_context";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
  tooltipConstant,
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
} from "../../../public/SvgIcons";
import { useEffect, useState } from "react";
import getValidators from "@/services/getValidators";
const ChainAnalytics = () => {
  const webSocketData = useLatestData();
  const { isLight } = useThemeData();
  const [validatorStatus, setValidatorStatus] = useState(InitStatus);

  const [validatorData, setValidatorData] = useState([]);
  const fetchData = async () => {
    try {
      let response = await getValidators(currentPage, tableLimit);
      setValidatorData(response?.data);
    } catch (err) {
      setValidatorStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="analytics_cards">
      <CardsOnchain
        text="Latest Block"
        balance={
          webSocketData?.blocks?.blocknumber
            ? webSocketData?.blocks?.blocknumber
            : 0
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
        balance={validatorData?.count ? validatorData?.count : 3}
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
            "0"
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
