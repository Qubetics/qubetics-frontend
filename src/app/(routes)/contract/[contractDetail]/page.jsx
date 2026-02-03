"use client";
import { useGetNetwork } from "@/components/contexts/networkChanged";
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
  noExponential,
  noExponentsValue,
} from "@/utils/commonFunctions";
import { Tabs } from "antd";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tokenicons } from "../../../../../public/SvgIcons";
import dynamic from "next/dynamic";
import InternalTxns from "@/components/contracts/InternalTxns";

const BlockDetail = dynamic(
  () => import("@/components/blockDetail/BlockDetail"),
  { ssr: false },
);
const ContractDtlTabs = dynamic(
  () => import("@/components/contractDetailTabs/ContractDtlTabs"),
  { ssr: false },
);
const AnalyticTab = dynamic(
  () => import("@/components/contracts/AnalyticTab"),
  { ssr: false },
);
const ContractDetails = dynamic(
  () => import("@/components/contracts/ContractDetails"),
  { ssr: false },
);
const ContractTransactions = dynamic(
  () => import("@/components/contracts/ContractTransactions"),
  { ssr: false },
);

const Events = dynamic(() => import("@/components/contracts/Events"), {
  ssr: false,
});
const Holder = dynamic(() => import("@/components/contracts/Holder"), {
  ssr: false,
});
const FilterResult = dynamic(
  () => import("@/components/FilterResult/FilterResult"),
  { ssr: false },
);
const Heading = dynamic(() => import("@/components/heading/Heading"), {
  ssr: false,
});
const Loader = dynamic(() => import("@/components/loader/Loader"), {
  ssr: false,
});
const Page = dynamic(() => import("../../notfound/page"), { ssr: false });

const ContractDetail = () => {
  const searchParam = useSearchParams();
  const [contractDetail, setContractDetail] = useState([]);
  const [contractDetailStatus, setContractDetailStatus] = useState(InitStatus);
  const [contractType, setContractType] = useState("");

  const [tab, setTab] = useState(searchParam.get("tab") || "0");
  const params = useParams();
  const router = useRouter();

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
      heading:
        contractDetail?.tokenName ||
        contractDetail?.ContractVerification?.contractname
          ? capitalizeWord(
              contractDetail?.tokenName ||
                contractDetail?.ContractVerification?.contractname,
            )
          : "-",
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
          loading="lazy"
        />
      ),
    },
    {
      text: "Total Supply",
      heading: contractDetail?.totalSupply
        ? formateTotalSupply(
            noExponentsValue(
              Number(contractDetail?.totalSupply) /
                10 ** Number(contractDetail?.decimal),
            ),
          )
        : "0",
      img: (
        <Image
          src="/tottalSupply.svg"
          className="welcomeLogo"
          height={60}
          width={60}
          alt="logo"
          loading="lazy"
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
    // chainType === "EVM Chain" &&
    contractType === contractTypes.ERC_20 && {
      label: "Transfer",
      key: "1",
      children: (
        <ContractTransactions hash={params?.contractDetail} tab={tab} />
      ),
    },
    // chainType === "EVM Chain" &&
    contractType === contractTypes.ERC_20 && {
      label: "Holders",
      key: "2",
      children: <Holder hash={params?.contractDetail} />,
    },
    // chainType === "EVM Chain" &&
    {
      label: "Events",
      key: "3",
      children: <Events hash={params?.contractDetail} />,
    },
    // chainType === "EVM Chain" &&
    {
      label: "Contract",
      key: "4",
      children: <ContractDtlTabs hash={params?.contractDetail} />,
    },
    // chainType === "EVM Chain" &&
    {
      label: "Internal Txns",
      key: "5",
      children: <InternalTxns hash={params?.contractDetail} />,
    },
    {
      label: "Analytics",
      key: "6",
      children: <AnalyticTab hash={params?.contractDetail} />,
    },
  ].filter(Boolean);

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
            {(contractType === contractTypes.ERC_20 ||
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
          />
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
