"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useParams } from "next/navigation";
import ContractDetails from "@/components/contracts/ContractDetails";
import Heading from "@/components/heading/Heading";
import ContractTransactions from "@/components/contracts/ContractTransactions";
import getContractDetails from "@/services/getContractDetails";
import BlockDetail from "@/components/blockDetail/BlockDetail";
import Loader from "@/components/loader/Loader";
import Page from "../../notfound/page";
import Holder from "@/components/contracts/Holder";
import Events from "@/components/contracts/Events";
import { useGetNetwork } from "@/components/contexts/networkChanged";
import ContractDtlTabs from "@/components/contractDetailTabs/ContractDtlTabs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  Routes,
  SuccessStatus,
  contractTypes,
} from "@/constant/constant";
import {
  capitalizeWord,
  formatMillionNumber,
  noExponential,
} from "@/utils/commonFunctions";
import { useContractData } from "@/components/contexts/contractContext";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { SmallLogo1 } from "../../../../../public/SvgIcons";

const ContractDetail = () => {
  const [contractDetail, setContractDetail] = useState([]);
  const [contractDetailStatus, setContractDetailStatus] = useState(InitStatus);
  const [contractType, setContractType] = useState("");
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const { setVerifyAddress } = useContractData();
  const [tab, setTab] = useState(0);
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
      text: "Name",
      heading: contractDetail?.contractName
        ? capitalizeWord(contractDetail?.contractName)
        : "-",
      img: (
        <Image
          src="/logoqubetic.svg"
          className="welcomeLogo"
          height={32}
          width={32}
          alt="logo"
        />
      ),
    },
    {
      text: "Symbol",
      heading: contractDetail?.symbol ? contractDetail?.symbol : "-",
      img: (
        <Image
          src="/logoqubetic.svg"
          className="welcomeLogo"
          height={32}
          width={32}
          alt="logo"
        />
      ),
    },
    {
      text: "Decimals",
      heading: contractDetail?.decimal
        ? noExponential(contractDetail?.decimal)
        : "-",
      img: (
        <Image
          src="/decimal.svg"
          className="welcomeLogo"
          height={32}
          width={32}
          alt="logo"
        />
      ),
    },
    {
      text: "Total Supply",
      heading: contractDetail?.totalSupply
        ? noExponential(
            Number(contractDetail?.totalSupply) /
              10 ** Number(contractDetail?.decimal)
          )
        : "0",
      img: (
        <Image
          src="/tottalSupply.svg"
          className="welcomeLogo"
          height={32}
          width={32}
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
  ];

  const handleTabSelect = (e) => {
    setTab(e);
  };

  return (
    <div className="contractDetail">
      <div className="container">
        <SearchbarComponent
          searchStatus={searchStatus}
          setSerachStatus={setSerachStatus}
        />
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
            defaultActiveKey="0"
            className="contracttabs"
            items={tabItems}
            onChange={(e) => handleTabSelect(e)}
            tabBarExtraContent={
              <div className="tabSerachBar">
                <SearchbarComponent />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
