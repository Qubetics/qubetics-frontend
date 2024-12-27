import React from "react";
import "./verifyContract.scss";
import { Input, Tooltip } from "antd";
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

export default ABICode;
