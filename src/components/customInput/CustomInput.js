"use client";
import React from "react";
import { Input } from "antd";
import "./CustomInput.scss";
const CustomInput = ({ label, onChange, fieldType, runsCheck, ...rest }) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="customInput">
      <label>{label}</label>
      {fieldType !== "tuple" && (
        <Input onChange={handleInputChange} {...rest} />
      )}
    </div>
  );
};

export default CustomInput;
