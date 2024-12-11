import { solidityFile } from "@/constant/constant";
import { toast } from "react-toastify";
import { verifyContractApi } from "./verifyContractApi";

export const verifyContractValidation = async (
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
) => {
  if (formData?.compilerType == solidityFile.SINGLE_FILE) {
    if (!solidityCode) {
      toast.error("Enter Solidity code");
      return;
    }
  }
  if (
    (formData?.compilerType == solidityFile.MULTI_PART_FILES &&
      fileList.length <= 0) ||
    (formData?.compilerType == solidityFile.JSON_INPUT && fileList.length <= 0)
  ) {
    toast.error("Please select  file");
    return;
  }
  for (let i = 0; i < inputs.length; i++) {
    if (
      (isChecked && inputs[i]?.libraryName == "") ||
      (isChecked && inputs[i]?.libraryAddress == "")
    ) {
      toast.error("Enter All fields of contract library");
      return;
    }
  }
  if (runsCheck && runsOptimizer <= 0) {
    toast.error("Minimum runs optimizer 1");
    return;
  }

  await verifyContractApi(
    formData,
    solidityCode,
    fileList,
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
