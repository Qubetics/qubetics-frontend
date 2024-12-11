import React from "react";
import "./verifyContract.scss";
import { Input } from "antd";
import { useContractData } from "@/components/contexts/contractContext";

const ABICode = () => {
  const { TextArea } = Input;
  const { abiCode, setAbiCode } = useContractData();

  return (
    <div className="textarea">
      <TextArea
        value={abiCode}
        autosize={{ minRows: 2, maxRows: 6 }}
        style={{ minHeight: "176px" }}
        onChange={(e) => setAbiCode(e.target.value)}
      />
    </div>
  );
};

export default ABICode;
