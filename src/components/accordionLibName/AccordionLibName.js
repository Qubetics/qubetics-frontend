"use client";
import React, { useState } from "react";
import { NextArrowIcon } from "../../assets/svg/SvgIcons";
import CustomInput from "../customInput/CustomInput";
import "../verifySmartContract/VerifySmartCont.scss";
import { Checkbox } from "antd";
import { useContractData } from "../contexts/contractContext";

function AccordionLibName() {
  const { setIsChecked, isChecked, inputs, setInputs } = useContractData();

  // Function to handle change in input value for name or address
  const handleInputChange = (index, fieldName, value, e) => {
    const newInputs = [...inputs];

    newInputs[index][fieldName] = value;
    setInputs(newInputs);
  };

  const onChange = (e) => {
    setIsChecked(e?.target?.checked);
    if (!e.target.checked) {
      // Reset inputs when checkbox is unchecked
      setInputs([{ libraryName: "", libraryAddress: "" }]);
    }
  };

  /*Add Input Box*/
  const addInputBox = () => {
    setInputs([...inputs, { libraryName: "", libraryAddress: "" }]);
  };

  /*Remove Input Box*/
  const removeInputBox = (index) => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };
  return (
    <div className="libraryName">
      <div className="checkboxItem">
        <Checkbox onChange={onChange}>
          <p>Add contract Library</p>
        </Checkbox>
      </div>
      {isChecked &&
        inputs.map((input, index) => (
          <div className="libraryName__inner" key={index}>
            <CustomInput
              type="text"
              label={`Library ${index} name`}
              placeholder="Enter Name"
              value={input?.libraryName}
              onChange={(value) =>
                handleInputChange(index, "libraryName", value)
              }
            />
            <NextArrowIcon />
            <CustomInput
              type="text"
              label={`Library ${index} contract address`}
              placeholder="Enter Address"
              value={input?.libraryAddress}
              onChange={(value) =>
                handleInputChange(index, "libraryAddress", value)
              }
            />
            {inputs?.length > 1 && (
              <button
                onClick={() => removeInputBox(index)}
                className="transparentbtns"
              >
                -
              </button>
            )}
            <button onClick={addInputBox} className="transparentbtns">
              +
            </button>
          </div>
        ))}
    </div>
  );
}

export default AccordionLibName;
