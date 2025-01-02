"use client";
import { verifyContractConstant } from "@/constant/constant";
import {
  CONTRACT_COMPILER_TYPE,
  CONTRACT_LICENSES,
} from "@/constant/dropDownConstant";
import getCompilerVersion from "@/services/getCompilerVersion";
import getContractDetails from "@/services/getContractDetails";
import getContractVerificationDetail from "@/services/getContractVeriicationDetail";
import { Button, Checkbox, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../app/(routes)/contract/verify/verifyContract.scss";
import { useContractData } from "../contexts/contractContext";
import CustomInput from "../customInput/CustomInput";
import CustomSelect from "../customSelect/CustomSelect";

function PublishContract({ steps, current, prev, next }) {
  const {
    contractAddress,
    setContractAddress,
    formData,
    setFormData,
    resetState,
    setSolidityCode,
    setFileList,
    setRunCheck,
    setInputs,
    setVerifyAddress,
    verifyAddress,
    setResetState,
  } = useContractData();
  const [isContractExist, setIsContractExist] = useState(false);

  const [isCheck, setIsCheck] = useState(false);
  const [isCheckedMessage, setIsCheckedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [compilerVersion, setCompilerVersion] = useState([]);

  useEffect(() => {
    if (resetState) {
      setContractAddress("");
      setFormData("");
      setSolidityCode("");
      setFileList("");
      setInputs("");
      setRunCheck(false);
      setVerifyAddress("");
      setResetState(false);
    }
  }, [resetState]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  useEffect(() => {
    getVersionList();
  }, []);

  const getVersionList = async () => {
    try {
      const versionList = await getCompilerVersion();
      const versions = versionList?.builds
        ?.filter((res) => !res?.longVersion.includes("nightly"))
        ?.map((res) => res?.longVersion)
        .reverse();
      setCompilerVersion(versions);
    } catch (error) {
      console.error("Error fetching compiler versions:", error);
    }
  };

  const isContractAddressExist = useCallback(
    async (address) => {
      try {
        if (address) {
          const status = await getContractDetails(address);
          if (!status?.error) {
            setIsContractExist(false);
          } else {
            setIsContractExist(true);
            setErrorMessage("Invalid Contract Address");
          }
        }
      } catch (e) {
        setIsContractExist(true);
        setErrorMessage("Invalid Contract Address");
      }
    },
    [contractAddress || verifyAddress]
  );

  const handleCustomInputChange = (value) => {
    setContractAddress(value);
    isContractAddressExist(value);
    if (value == "") {
      setIsContractExist(false);
    }
  };

  useEffect(() => {
    if (verifyAddress) {
      isContractAddressExist(verifyAddress);
      setVerifyAddress(verifyAddress);
    }
    if (verifyAddress && resetState) {
      setVerifyAddress("");
      setResetState(false);
    }
  }, [verifyAddress, resetState]);
  const defaultValue = "Please Select";

  const onChange = (e) => {
    setIsCheck(e.target.checked);
    setIsCheckedMessage("");
  };

  const validateAndProceed = async () => {
    if (
      (!contractAddress && !verifyAddress) ||
      !formData?.compilerType ||
      !formData?.compilerVersion ||
      !formData?.licenseType
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!isCheck) {
      setIsCheckedMessage("Please check the Terms of Service");
      return;
    }
    setIsLoading(true);
    const isContractVerified = await getContractVerificationDetail(
      contractAddress || verifyAddress
    );
    if (isContractVerified) {
      setIsLoading(false);
      const verificationType = isContractVerified.verificationType;
      if (verificationType === 1 || verificationType === 2) {
        toast.success("Contract Already Verified");
        return;
      } else if (verificationType === 0) {
        toast.success("Contract Verification in Process");
        return;
      }
    }
    next();
  };

  return (
    <div className="verifyPublish">
      {/* <div className="verifyPublish__left">
        <h3>{verifyContractConstant?.VERIFY_AND_PUBLISH_CONTRACT}</h3>
        {Listing?.map((listing, index) => (
          <p key={index}>{listing}</p>
        ))}
      </div> */}
      <div className="verifyPublish__right">
        <CustomInput
          label={verifyContractConstant.INPUT_LABEL}
          placeholder="Enter contract address here"
          value={contractAddress || verifyAddress}
          disabled={verifyAddress}
          onChange={handleCustomInputChange}
        />
        {isContractExist && (
          <p style={{ color: "red", paddingBottom: "20px" }}>{errorMessage}</p>
        )}
        <CustomSelect
          label={verifyContractConstant.SELECT_COMPILE_TYPE}
          options={CONTRACT_COMPILER_TYPE}
          value={formData.compilerType}
          onChange={(value) => handleInputChange("compilerType", value)}
          defaultValue={defaultValue}
        />
        <CustomSelect
          label={verifyContractConstant.SELECT_COMPILE_VERSION}
          options={
            compilerVersion?.length > 0
              ? compilerVersion?.map((version) => ({
                  label: version,
                  value: "v" + version,
                }))
              : []
          }
          value={formData.compilerVersion}
          onChange={(value) => handleInputChange("compilerVersion", value)}
          defaultValue={defaultValue}
        />

        <CustomSelect
          label={verifyContractConstant.SELECT_LICENSE_TYPE}
          options={CONTRACT_LICENSES}
          defaultValue={defaultValue}
          value={formData.licenseType}
          onChange={(value) => handleInputChange("licenseType", value)}
        />

        <div>
          <div className="checkboxItem">
            <p>
              <Checkbox onChange={onChange}></Checkbox> I agree to the{" "}
              <span>Terms Of Service</span>
            </p>
          </div>
          {isCheckedMessage && (
            <p style={{ color: "red", marginBottom: "31px" }}>
              {isCheckedMessage}
            </p>
          )}
          {steps && current < steps.length - 1 && (
            <Button
              type="primary"
              onClick={validateAndProceed}
              className="bluebtn"
              disabled={isContractExist || isLoading}
            >
              {"Next"}
            </Button>
          )}
          {steps && current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button
              style={{
                margin: "0 8px",
              }}
              onClick={() => prev()}
            >
              Previous
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
export default PublishContract;
