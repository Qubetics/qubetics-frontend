"use client";
import React, { useState } from "react";
import CustomInput from "../customInput/CustomInput";
import "../verifySmartContract/VerifySmartCont.scss";
import CustomSelect from "../customSelect/CustomSelect";
import { EVM_VERSION } from "@/constant/dropDownConstant";
import { Checkbox } from "antd";
import { useContractData } from "../contexts/contractContext";

function MiscSetting() {
  const {
    runsOptimizer,
    setRunsOptimizer,
    runsCheck,
    setRunCheck,
    formData,
    EVMVersion,
    setEVMVersion,
  } = useContractData();
  const handleCustomInputChange = (value) => {
    setRunsOptimizer(value);
  };
  const handleVersionChange = (value) => {
    setEVMVersion(value);
  };
  const onChange = (e) => {
    setRunCheck(e.target.checked);
  };
  return (
    <div className="miscSetting">
      {runsCheck ? (
        <CustomInput
          value={runsOptimizer}
          onChange={handleCustomInputChange}
          label={
            <div className="checkMisc">
              <p style={{ color: "white" }}>Runs (Optimizer)</p>
              <Checkbox onChange={onChange} checked={runsCheck} />
            </div>
          }
        />
      ) : (
        <p>
          <div className="checkMisc">
            <p style={{ color: "white" }}>Runs (Optimizer)</p>
            <Checkbox onChange={onChange} checked={runsCheck} />
          </div>
        </p>
      )}

      <CustomSelect
        label="EVM Version to target"
        options={EVM_VERSION}
        // value={formData.compilerVersion}
        onChange={handleVersionChange}
        defaultValue={EVMVersion}
      />
    </div>
  );
}

export default MiscSetting;
