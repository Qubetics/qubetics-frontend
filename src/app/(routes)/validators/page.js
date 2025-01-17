"use client";
import CardsOnchain from "@/components/cardOnChain/CardsOnchain";
import { useLatestData } from "@/components/contexts/latest_data";
import Heading from "@/components/heading/Heading";
import Pagination from "@/components/Pagination/Pagination";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { SkeletonTableWrapper } from "@/components/SkeletonTableWrapper/SkeletonTableWrapper";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
  tableLimit,
} from "@/constant/constant";
import { validatorsColumn } from "@/constant/graphTableValues";
import getValidators from "@/services/getValidators";
import { simplifyNumber } from "@/utils/commonFunctions";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
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

  const webSocketData = useLatestData();
  const parsedData =
    webSocketData?.analytics?.validatorData &&
    JSON.parse(webSocketData?.analytics?.validatorData);

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
      text: (
        <>
          Onchain APY
          <Tooltip
            color="rgb(49 52 56)"
            title=" APY is an estimated % of rewards you will earn while staking Qubetics coins over the annual period. APY is adjusted daily, and the estimated rewards may be different from the actual rewards generated."
          >
            <InfoCircleOutlined className="infoIcon" />
          </Tooltip>
        </>
      ),
      balance: parsedData?.apy ? parsedData?.apy + " %" : "0 %",
      img: <Onchainapy />,
      contract: "true",
    },
    {
      id: 2,
      text: (
        <>
          Total Validators
          <Tooltip
            color="rgb(49 52 56)"
            title="Total Validators: This metric represents the total count of participants tasked with validating transactions within a blockchain network"
          >
            <InfoCircleOutlined className="infoIcon" />
          </Tooltip>
        </>
      ),
      balance: validatorData?.count ? validatorData?.count : "0",
      img: <Totalvalidators />,
      contract: true,
    },
    {
      id: 3,
      text: (
        <>
          Bonded Rate
          <Tooltip
            color="rgb(49 52 56)"
            title="The percentage of Qubetics coins bonded by the validator and delegators in the network with respect to the total supply of Qubetics."
          >
            <InfoCircleOutlined className="infoIcon" />
          </Tooltip>
        </>
      ),
      balance: parsedData?.bondedRate
        ? simplifyNumber(parsedData?.bondedRate) + " %"
        : "0 %",
      img: <Bondedrate />,
      contract: "true",
    },
    {
      id: 4,
      text: (
        <>
          Active Validators
          <Tooltip
            color="rgb(49 52 56)"
            title="Active Validators: These are validators presently engaged in validating transactions on the blockchain."
          >
            <InfoCircleOutlined className="infoIcon" />
          </Tooltip>
        </>
      ),
      balance:
        validatorData?.activeValidators || validatorData?.activeCount
          ? validatorData?.activeValidators || validatorData?.activeCount
          : "0",
      img: <Activevalidators />,
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
      {/* {validatorStatus === InitStatus || validatorStatus === FetchingStatus ? (
        <Loader />
      ) : validatorStatus === SuccessStatus ? (
        <> */}
      <div className="container">
        <SearchbarComponent
          searchStatus={searchStatus}
          setSerachStatus={setSerachStatus}
        />
        <Heading heading="Validators" />
        <div className="cardContract">
          {cards?.map((item) => (
            <CardsOnchain
              key={item?.id}
              text={item?.text}
              balance={item?.balance}
              img={item?.img}
              contract={item?.contract}
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
      {/* </>
      ) : (
        <Page />
      )} */}
    </div>
  );
}

export default page;
