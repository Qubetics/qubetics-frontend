"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { useLatestData } from "@/components/contexts/latest_data";
import FilterResult from "@/components/FilterResult/FilterResult";
import Heading from "@/components/heading/Heading";
import Pagination from "@/components/Pagination/Pagination";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { validatorsColumn } from "@/constant/graphTableValues";
import getStatistics from "@/services/getStatistics";
import getValidators from "@/services/getValidators";
import { formatDecimal } from "@/utils/commonFunctions";
import { useEffect, useState } from "react";
import {
  Activevalidators,
  Bondedrate,
  Datnotfound,
  Onchainapy,
  Totalvalidators,
} from "../../../../public/SvgIcons";
import "./validators.scss";

function page() {
  const [currentPage, setCurrentPage] = useState(1);
  const [validatorData, setValidatorData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [validatorStatus, setValidatorStatus] = useState(InitStatus);
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [stats, setStats] = useState("");

  const webSocketData = useLatestData();
  const parsedData =
    webSocketData?.analytics?.validatorData &&
    JSON.parse(webSocketData?.analytics?.validatorData);

  const fetchEVMStats = async () => {
    try {
      let respose = await getStatistics();
      setStats(respose?.data);
    } catch (err) {
      return err;
    }
  };

  useEffect(() => {
    fetchEVMStats();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setValidatorStatus(FetchingStatus);
        let response = await getValidators(currentPage, tableLimit);
        setValidatorData(response?.data);
        setValidatorStatus(SuccessStatus);
        const count = Number(response?.data?.count ?? 0) / tableLimit;
        setTotalPages(Math.ceil(count ?? 0));
      } catch (err) {
        setValidatorStatus(ErrorStatus);
        return err;
      }
    };
    fetchData();
  }, [currentPage]);

  const cards = [
    {
      id: 1,
      title:
        "The annual percentage yield earned on staked coins, calculated directly from on-chain data.",
      text: <>Onchain APY</>,
      balance: (stats?.apy ? stats?.apy : 0) + " %",
      img: <Onchainapy />,
      contract: "true",
    },
    {
      id: 2,
      title:
        "The total number of validators participating in securing the network by validating and proposing blocks.",
      text: <>Total Validators</>,
      balance: validatorData?.count ? validatorData?.count : "0",
      img: <Totalvalidators />,
      contract: true,
    },
    {
      id: 3,
      title:
        "The percentage of the total circulating supply of tokens that is currently staked or bonded to validators.",

      balance: stats?.bondedRate
        ? `${formatDecimal(Number(stats?.bondedRate))}%`
        : "0 %",
      img: <Bondedrate />,
      contract: "true",
      text: "Bonded Rate",
    },
    {
      id: 4,
      title:
        "The number of validators actively participating in the network at the current time.",

      balance:
       validatorData?.activeCount|| validatorData?.activeValidators 
          ? validatorData?.activeCount || validatorData?.activeValidators 
          : "0",
      img: <Activevalidators />,
      text: "Active Validators",
      contract: "true",
    },
  ];

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages) {
      setCurrentPage(totalPages);
    }
  };

  const handleFirst = () => {
    if (currentPage <= totalPages) {
      setCurrentPage(1);
    }
  };

  return (
    <div className="validatorsCard">
      <div className="container">
        <FilterResult />
        <Heading heading="Validators" />
        <div className="cardContract">
          {cards?.map((item) => (
            <CardsOnchain
              key={item?.id}
              text={item?.text}
              balance={item?.balance}
              img={item?.img}
              contract={item?.contract}
              title={item?.title}
            />
          ))}
        </div>
        <SkeletonTableWrapper
          className="commontable"
          isSkeleton={
            validatorStatus === FetchingStatus || validatorStatus === InitStatus
          }
          columns={validatorsColumn}
          dataSource={validatorData?.validators}
          pagination={false}
          locale={{
            emptyText: (
              <div>
                <Datnotfound />
                <p>No data </p>
              </div>
            ),
          }}
        />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            disablePrev={currentPage === 1}
            disableNext={currentPage === totalPages}
            handleFirst={handleFirst}
            handleLast={handleLast}
          />
        )}
      </div>
    </div>
  );
}

export default page;
