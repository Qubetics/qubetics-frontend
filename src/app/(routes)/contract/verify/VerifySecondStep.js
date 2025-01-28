"use client";
import React, { useState, useEffect } from "react";
import "./verifyContract.scss";
import VerifySmartCont from "@/components/verifySmartContract/VerifySmartCont";
import { Button, Checkbox } from "antd";
import { useContractData } from "@/components/contexts/contractContext";
import SolidityCode from "./SolidityCode";
import UploadFile from "./UploadFile";
import { FetchingStatus, InitStatus, solidityFile } from "@/constant/constant";
import Loader from "@/components/loader/Loader";
import { verifyContractValidation } from "./verifyContractValidation";

function VerifySecondStep({ steps, current, prev }) {
  const {
    isChecked,
    inputs,
    formData,
    contractAddress,
    solidityCode,
    setContractAddress,
    resetState,
    setResetState,
    runsCheck,
    runsOptimizer,
    EVMVersion,
    setAbiCode,
    abiCode,
    verifyAddress,
    setVerifyAddress,
    setJSONFile,
    JSONFile,
  } = useContractData();
  const [fileList, setFileList] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState(InitStatus);

  useEffect(() => {
    if (resetState) {
      // Reset all states here
      setFileList([]);
      setVerifyStatus(InitStatus);
      setResetState(false);
      setContractAddress("");
      setAbiCode("");
    }
  }, [resetState]);

  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
  };

  useEffect(() => {
    if (
      formData?.compilerType == solidityFile.JSON_INPUT &&
      fileList.length > 0
    ) {
      const fileLists = fileList[0]?.originFileObj;
      if (fileLists) {
        const fileReader = new FileReader();
        fileReader?.readAsText(fileLists, "UTF-8");
        fileReader.onload = (e) => {
          setJSONFile(e.target.result);
        };
      }
    }
  }, [fileList, formData]);

  const handleClick = async () => {
    await verifyContractValidation(
      formData,
      solidityCode,
      fileList,
      isChecked,
      inputs,
      runsCheck,
      runsOptimizer,
      contractAddress,
      setResetState,
      setVerifyStatus,
      prev,
      EVMVersion,
      abiCode,
      verifyAddress,
      JSONFile
    );
  };
  return (
    <div>
      {verifyStatus == InitStatus ||
        (verifyStatus == FetchingStatus && <Loader />)}
      <VerifySmartCont
        Children={
          <>
            {formData?.compilerType == solidityFile.SINGLE_FILE ? (
              <SolidityCode />
            ) : (
              <UploadFile
                fileList={fileList}
                setFileList={setFileList}
                formData={formData}
              />
            )}
          </>
        }
        FormButton={() => (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              gap: "20px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/*
            <div className="checkboxItem">
              <Checkbox checked={isCheck} onChange={onChange}>
                I agree to the Terms Of Service
              </Checkbox>
            </div>

            {isCheckedMessage && (
              <p style={{ color: "red", marginBottom: "31px" }}>
                {isCheckedMessage}
              </p>
            )}
            */}

            {current > 0 && (
              <Button
                style={{
                  margin: "0 20px",
                }}
                onClick={() => prev()}
              >
                Previous
              </Button>
            )}
            {steps && current === steps.length - 1 && (
              <button
                onClick={handleClick}
                className="headermetaBtn preNextbtn"
              >
                Done
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
}

export default VerifySecondStep;
