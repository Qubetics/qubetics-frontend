"use client";
import {
  ErrorStatus,
  FetchingStatus,
  InitStatus,
  SuccessStatus,
} from "@/constant/constant";
import getContractVerificationDetail from "@/services/getContractVeriicationDetail";
import getProxyVerificationDetail from "@/services/getProxyVerificationDetail";
import { Button } from "antd";
import { useEffect, useState } from "react";
import ProxyModal from "../ProxyModal/ProxyModal";
import { useContractData } from "../contexts/contractContext";
import ByteCreationCode from "../contractVerificationDetails/ByteCreationCode";
import CompilerMessage from "../contractVerificationDetails/CompilerMessage";
import ContractAbi from "../contractVerificationDetails/ContractAbi";
import ContractNameData from "../contractVerificationDetails/ContractNameData";
import SourceCode from "../contractVerificationDetails/SourceCode";
import VerificationStatus from "../contractVerificationDetails/VerificationStatus";
import { errorWarning } from "../contractVerificationDetails/showErrorWarningMessage";
import Loader from "../loader/Loader";
import "./ContractDtlTabs.scss";

function CodeTabContent({ hash }) {
  const [status, setStatus] = useState(InitStatus);
  const [contractDetailData, setContractDetailData] = useState([]);
  const { setVerifyAddress } = useContractData();
  const [implementationAddress, setimplementationAddress] = useState("");
  const [compilerMessage, setCompilerMessage] = useState("");
  const [proxyVerified, setProxyVerified] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setStatus(FetchingStatus);
    fetchContractDetails();
  }, []);

  const fetchContractDetails = async () => {
    try {
      const [contractResponse, proxyResponse] = await Promise.all([
        getContractVerificationDetail(hash),
        getProxyVerificationDetail(hash),
      ]);

      if (contractResponse) {
        setContractDetailData(contractResponse);
        // setStatus(SuccessStatus);
        setCompilerMessage(errorWarning(contractResponse));
      }

      if (proxyResponse) {
        setimplementationAddress(proxyResponse?.implementation);
        setProxyVerified(proxyResponse?.verified);
      }
      setStatus(SuccessStatus);
    } catch (err) {
      setStatus(ErrorStatus);
      console.error(err);
    }
  };

  return (
    <div className="codeTabContent">
      {status === InitStatus || status === FetchingStatus ? (
        <Loader />
      ) : (
        <div className="codeTabContent__contractSource">
          <VerificationStatus
            contractDetailData={contractDetailData}
            compilerMessage={compilerMessage}
            setVerifyAddress={setVerifyAddress}
            hash={hash}
          />

          {/**************************************************************************/}

          {/***************Check is it a Proxy??***************/}

          {implementationAddress &&
            contractDetailData?.verificationType > 0 && (
              <Button
                type="primary"
                className="bluebtn"
                style={{ height: 40, marginLeft: "73%" }}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Is this a proxy?
              </Button>
            )}
          {/*****************************************************/}
        </div>
      )}

      {contractDetailData?.verificationType && (
        <>
          {/*****************SHOW CONTRACT NAME DETAILS**************/}

          <div className="codeTabContent__contractName">
            {contractDetailData?.verificationType != -1 && (
              <ContractNameData contractDetailData={contractDetailData} />
            )}
          </div>

          {/**********************************************************/}

          {/*****************SHOW COMPILER MESSAGE**************/}

          <CompilerMessage compilerMessage={compilerMessage} />

          {/**********************************************************/}

          {/*****************SHOW CONTRACT SOURCE CODE**************/}

          <SourceCode contractDetailData={contractDetailData} />

          {/**********************************************************/}

          {/**********************SHOW CONTARCT ABI**************/}

          <ContractAbi contractDetailData={contractDetailData} />

          {/**********************************************************/}
        </>
      )}

      {/**********************SHOW CREATION CODE AND DEPLOYED BYTE CODE*******************/}

      <ByteCreationCode contractDetailData={contractDetailData} />

      {/***********************************************************************************/}

      {/*********************PROXY MODAL OPEN***********************/}

      {isModalOpen && (
        <ProxyModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          implementationAddress={implementationAddress}
          proxyVerified={proxyVerified}
          hash={hash}
        />
      )}

      {/************************************************************/}
    </div>
  );
}

export default CodeTabContent;
