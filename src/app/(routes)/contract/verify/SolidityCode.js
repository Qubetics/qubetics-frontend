import React from "react";
import "./verifyContract.scss";
import {  Input, Tooltip } from "antd";
import { useContractData } from "@/components/contexts/contractContext";

const SolidityCode = () => {
  const { TextArea } = Input;
  const { solidityCode, setSolidityCode } = useContractData();

  return (
    <div className="textarea">
      <label>Enter the Solidity Contract Code below :- </label>
      <TextArea
        value={solidityCode}
        autosize={{ minRows: 2, maxRows: 6 }}
        style={{ minHeight: "176px" }}
        onChange={(e) => setSolidityCode(e.target.value)}
      />
      <Tooltip title="Paste">
        <span
          // onClick={handlePaste}
          className="textAreaPaste"
        >
          Paste
        </span>
      </Tooltip>
    </div>
  );
};

export default SolidityCode;
