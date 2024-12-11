"use client";
import { useState, createContext, useContext } from "react";

export const ContractContext = createContext();

export function ContractVerificationProvider({ children }) {
  const [runsOptimizer, setRunsOptimizer] = useState(200);
  const [runsCheck, setRunCheck] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [formData, setFormData] = useState({
    compilerType: "",
    compilerVersion: "",
    licenseType: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [inputs, setInputs] = useState([
    { libraryName: "", libraryAddress: "" },
  ]);
  const [EVMVersion, setEVMVersion] = useState("default");
  const [solidityCode, setSolidityCode] = useState("");
  const [fileList, setFileList] = useState([]);
  const [resetState, setResetState] = useState(false);
  const [abiCode, setAbiCode] = useState("");
  const [JSONFile, setJSONFile] = useState("");
  const [verifyAddress, setVerifyAddress] = useState("");
  const [connectAddress, setConnectAddress] = useState("");

  return (
    <ContractContext.Provider
      value={{
        runsOptimizer,
        setRunsOptimizer,
        runsCheck,
        setRunCheck,
        contractAddress,
        setContractAddress,
        setFormData,
        formData,
        setIsChecked,
        isChecked,
        inputs,
        setInputs,
        setEVMVersion,
        EVMVersion,
        setSolidityCode,
        solidityCode,
        setFileList,
        fileList,
        resetState,
        setResetState,
        setAbiCode,
        abiCode,
        setJSONFile,
        JSONFile,
        verifyAddress,
        setVerifyAddress,
        setConnectAddress,
        connectAddress,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}

export const useContractData = () => useContext(ContractContext);
