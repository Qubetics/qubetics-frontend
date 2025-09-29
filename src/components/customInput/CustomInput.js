"use client";
import React from "react";
import { Input } from "antd";
import "./CustomInput.scss";
const CustomInput = ({
  label,
  onChange,
  placeholder,
  fieldType,
  runsCheck,
  ...rest
}) => {
  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="customInput">
      <label>{label}</label>
      {/* {fieldType !== "tuple" && ( */}
      <Input
        placeholder={placeholder}
        autoComplete="off"
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = placeholder)}
        onChange={handleInputChange}
        {...rest}
      />
      {/* )} */}
    </div>
  );
};

export default CustomInput;
