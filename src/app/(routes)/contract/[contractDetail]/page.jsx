"use client";
import BlockDetail from "@/components/blockDetail/BlockDetail";
import { useContractData } from "@/components/contexts/contractContext";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import ContractDtlTabs from "@/components/contractDetailTabs/ContractDtlTabs";
import AnalyticTab from "@/components/contracts/AnalyticTab";
import ContractDetails from "@/components/contracts/ContractDetails";
import ContractTransactions from "@/components/contracts/ContractTransactions";
import Events from "@/components/contracts/Events";
import Holder from "@/components/contracts/Holder";
import FilterResult from "@/components/FilterResult/FilterResult";
import Heading from "@/components/heading/Heading";
import Loader from "@/components/loader/Loader";
import {
  contractTypes,
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";
import getContractDetails from "@/services/getContractDetails";
import {
  capitalizeWord,
  formateTotalSupply,
  formatMillionNumber,
  noExponential,
  noExponentsValue,
} from "@/utils/commonFunctions";
import { Tabs } from "antd";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tokenicons } from "../../../../../public/SvgIcons";
import Page from "../../notfound/page";
const ContractDetail = () => {
  const searchParam = useSearchParams();
  const [contractDetail, setContractDetail] = useState([]);
  const [contractDetailStatus, setContractDetailStatus] = useState(InitStatus);
  const [contractType, setContractType] = useState("");
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const { setVerifyAddress } = useContractData();
  const [tab, setTab] = useState(searchParam.get("tab") || "0");
  const params = useParams();
  const router = useRouter();

  let chainType =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  const { isNetworkChanged } = useGetNetwork();

  const fetchContractDetails = async () => {
    try {
      let response = await getContractDetails(params?.contractDetail);
      setContractDetail(response?.data?.contracts);
      setContractType(response?.data?.contracts?.contractType);
      setContractDetailStatus(SuccessStatus);
    } catch (err) {
      setContractDetailStatus(ErrorStatus);
      return err;
    }
  };

  useEffect(() => {
    setContractDetailStatus(FetchingStatus);
    fetchContractDetails();
  }, []);

  useEffect(() => {
    if (isNetworkChanged === true) {
      setContractDetailStatus(FetchingStatus);
      fetchContractDetails();
    }
  }, [isNetworkChanged]);

  const detail = [
    {
      text: "Token Name",
      heading: contractDetail?.tokenName
        ? capitalizeWord(contractDetail?.tokenName)
        : "-",
      img: <Tokenicons width={55} height={55} />,
    },
    {
      text: "Symbol",
      heading: contractDetail?.symbol ? contractDetail?.symbol : "-",
      img:
        contractDetail?.ContractVerification &&
        contractDetail?.ContractVerification?.iconUrl !== "" ? (
          <img
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              height: "55px",
              width: "55px",
            }}
            src={contractDetail?.ContractVerification?.iconUrl}
            className="welcomeLogo"
            alt="logo"
          />
        ) : (
          <div>
            <div className="imgIcon">
              {<Tokenicons width={55} height={55} />}
            </div>
          </div>
        ),
    },
    {
      text: "Decimal",
      heading: contractDetail?.decimal
        ? noExponential(contractDetail?.decimal)
        : "-",
      img: (
        <Image
          src="/decimal.svg"
          className="welcomeLogo"
          height={60}
          width={60}
          alt="logo"
        />
      ),
    },
    {
      text: "Total Supply",
      heading: contractDetail?.totalSupply
        ? formateTotalSupply(
            noExponentsValue(
              Number(contractDetail?.totalSupply) /
                10 ** Number(contractDetail?.decimal)
            ).toFixed(6)
          )
        : "0",
      img: (
        <Image
          src="/tottalSupply.svg"
          className="welcomeLogo"
          height={60}
          width={60}
          alt="logo"
        />
      ),
    },
  ];

  const tabItems = [
    {
      label: "Transactions",
      key: "0",
      children: (
        <ContractTransactions hash={params?.contractDetail} tab={tab} />
      ),
    },
    chainType === "EVM Chain" &&
      contractType === contractTypes.ERC_20 && {
        label: "Transfer",
        key: "1",
        children: (
          <ContractTransactions hash={params?.contractDetail} tab={tab} />
        ),
      },
    chainType === "EVM Chain" &&
      contractType === contractTypes.ERC_20 && {
        label: "Holders",
        key: "2",
        children: <Holder hash={params?.contractDetail} />,
      },
    chainType === "EVM Chain" && {
      label: "Events",
      key: "3",
      children: <Events hash={params?.contractDetail} />,
    },
    chainType === "EVM Chain" && {
      label: "Contract",
      key: "4",
      children: <ContractDtlTabs hash={params?.contractDetail} />,
    },
    chainType === "EVM Chain" && {
      label: "Analytics",
      key: "5",
      children: <AnalyticTab />,
    },
  ];

  const handleTabSelect = (e) => {
    setTab(e);
    const newSearchParams = new URLSearchParams(searchParam);
    newSearchParams.set("tab", e);
    router.replace(`?${newSearchParams.toString()}`, {
      shallow: true,
      scroll: false,
    });
  };

  return (
    <div className="contractDetail contractsItems">
      <div className="container">
        {/* <SearchbarComponent
          searchStatus={searchStatus}
          setSerachStatus={setSerachStatus}
        /> */}
        <FilterResult />
        <Heading heading="Contract Details" />
        {contractDetailStatus === InitStatus ||
        contractDetailStatus === FetchingStatus ? (
          <Loader />
        ) : contractDetailStatus === SuccessStatus ? (
          <>
            <ContractDetails
              data={contractDetail}
              status={contractDetailStatus}
            />
            {((contractType === contractTypes.ERC_20 &&
              contractDetail?.symbol) ||
              (contractType === contractTypes.ERC_721 &&
                contractDetail?.symbol)) && (
              <>
                <div className="common_header">
                  <h2>Token Information</h2>
                </div>
                <div className="tokenInfoData">
                  <BlockDetail details={detail} />
                </div>
              </>
            )}
          </>
        ) : (
          <Page />
        )}
        <div className="transecSec">
          <Tabs
            activeKey={tab}
            defaultActiveKey="0"
            className="contracttabs"
            items={tabItems}
            onChange={(e) => handleTabSelect(e)}
            // tabBarExtraContent={
            //   <div className="tabSerachBar">
            //     <SearchbarComponent />
            //   </div>
            // }
          />
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
