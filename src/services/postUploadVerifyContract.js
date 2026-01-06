import { EXPLORER_CONTRACT_VERIFY_URL } from "@/constant/constant";
import { customToast } from "@/components/common/toast";

export default async function postUploadVerifyContract(
  checkAddress,
  formData,
  fileList,
  runsCheck,
  runsOptimizer,
  EVMVersion,
  abiCode
) {
  const contractData = new FormData();
  fileList?.forEach((files) => {
    contractData.append("files", files.originFileObj);
  });
  contractData.append("contractaddress", checkAddress);
  contractData.append("codeformat", formData.compilerType);
  contractData.append("compilerversion", formData.compilerVersion);
  contractData.append("licenseType", +formData.licenseType);
  contractData.append("optimizationUsed", runsCheck == false ? 0 : 1);
  contractData.append("runs", runsOptimizer);
  contractData.append("evmVersion", EVMVersion);
  contractData.append("abi", abiCode);

  try {
    const response = await fetch(`${EXPLORER_CONTRACT_VERIFY_URL}verify`, {
      method: "POST",
      body: contractData,
      // headers: {
      //   "Content-Type": "application/json",
      // },
    });

    let result = await response.json();
    return result;
  } catch (error) {
    customToast.error(error);
    return error;
  }
}
