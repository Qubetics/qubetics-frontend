"use client";
import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import "./ContractDtlTabs.scss";
import CodeTabContent from "./CodeTabContent";
import ReadCodeContent from "./ReadCodeContent";
import WriteContent from "./WriteContent";
import Loader from "../loader/Loader";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";
import getAbiData from "@/services/getAbiData";

function ContractDtlTabs({ hash }) {
  const [AbiStatus, setAbiStatus] = useState(InitStatus);
  const [abiData, setAbiData] = useState([]);
  const [proxyAbiData, setProxyAbiData] = useState([]);

  useEffect(() => {
    setAbiStatus(FetchingStatus);
    fetchAbiData();
  }, []);

  const fetchAbiData = async () => {
    try {
      let response = await getAbiData(hash);
      setAbiData(response?.abi);
      setProxyAbiData(response?.proxyABI);
      setAbiStatus(SuccessStatus);
    } catch (err) {
      setAbiStatus(ErrorStatus);
      return err;
    }
  };
  const items = [
    {
      key: "1",
      label: "Code",
      children: <CodeTabContent hash={hash} />,
    },
    abiData &&
      abiData?.length > 0 && {
        key: "2",
        label: "Read Contract",
        children: <ReadCodeContent abiData={abiData} hash={hash} />,
      },
    abiData &&
      abiData?.length > 0 && {
        key: "3",
        label: "Write Contract",
        children: <WriteContent abiData={abiData} hash={hash} />,
      },
    proxyAbiData &&
      proxyAbiData.length > 0 && {
        key: "4",
        label: "Read As Proxy",
        children: <ReadCodeContent abiData={proxyAbiData} hash={hash} />,
      },
    proxyAbiData &&
      proxyAbiData.length > 0 && {
        key: "5",
        label: "Write As Proxy",
        children: <WriteContent abiData={proxyAbiData} hash={hash} />,
      },
  ];
  return (
    <>
      {AbiStatus === InitStatus || AbiStatus === FetchingStatus ? (
        <Loader />
      ) : abiData?.length > 0 ? (
        <div className="contractDetailTabs">
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      ) : (
        <CodeTabContent hash={hash} />
      )}
    </>
  );
}

export default ContractDtlTabs;
