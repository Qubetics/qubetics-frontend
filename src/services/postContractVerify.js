import { EXPLORER_CONTRACT_VERIFY_URL } from "@/constant/constant";
import { toast } from "react-toastify";

export const postContractVerify =  async (
  contractAddress,
  formData,
  solidityCode,
  runsCheck,
  runsOptimizer,
  EVMVersion,
  abiCode
)=> {
  const data = {
    contractaddress: contractAddress,
    codeformat: formData.compilerType,
    compilerversion: formData.compilerVersion,
    sourceCode: solidityCode,
    licenseType: +formData.licenseType,
    optimizationUsed: runsCheck == false ? 0 : 1,
    runs: runsOptimizer,
    evmVersion: EVMVersion,
    abi: abiCode,
  };
  try {
    const response = await fetch(`${EXPLORER_CONTRACT_VERIFY_URL}verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let result = await response.json();
    return result;
  } catch (error) {
    toast.error(error);
    return error;
  }
}
