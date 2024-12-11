import {
  FetchingStatus,
  SuccessStatus,
  solidityFile,
} from "@/constant/constant";
import postContractVerify from "@/services/postContractVerify";
import postUploadVerifyContract from "@/services/postUploadVerifyContract";
import { toast } from "react-toastify";

export const verifyContractApi = async (
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
) => {
  setVerifyStatus(FetchingStatus);
  const checkAddress = contractAddress ? contractAddress : verifyAddress;
  const uploadCode = solidityCode ? solidityCode : JSONFile;
  try {
    let res;
    if (
      ((formData?.compilerType === solidityFile.SINGLE_FILE &&
        checkAddress &&
        uploadCode) ||
        formData?.compilerType === solidityFile.JSON_INPUT) &&
      checkAddress &&
      uploadCode
    ) {
      res = await postContractVerify(
        checkAddress,
        formData,
        uploadCode,
        runsCheck,
        runsOptimizer,
        EVMVersion,
        abiCode
      );
    } else if (checkAddress && fileList) {
      res = await postUploadVerifyContract(
        checkAddress,
        formData,
        fileList,
        runsCheck,
        runsOptimizer,
        EVMVersion,
        abiCode
      );
    } else {
      throw new Error("Invalid parameters for API call");
    }

    if (res.status == 1) {
      setVerifyStatus(SuccessStatus);
      toast.success("Verification Initiated");
      setResetState(true);
      prev();
    } else {
      toast.error(res?.message || "Unknown error occurred");
      setResetState(true);
      prev();
    }
  } catch (error) {
    toast.error("An error occurred while verifying contract");
    setResetState(true);
    setVerifyStatus(SuccessStatus);
  }
};
