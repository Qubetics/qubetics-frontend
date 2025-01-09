// CustomSelect.js
import React from "react";
import { Select } from "antd";
import "./CustomSelect.scss";
const { Option } = Select;

function CustomSelect({ label, options, value, onChange, defaultValue, placeholder }) {
  const handleChange = (selectedValue) => {
    onChange(selectedValue);
  };

  return (
    <div className="customSelect">
      <label>{label}</label>
      <Select getPopupContainer={(trigger) => trigger.parentNode} value={value} onChange={handleChange} defaultValue={defaultValue} placeholder={placeholder}>
        {options.map((option, index) => (
          <Option key={index} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default CustomSelect;
