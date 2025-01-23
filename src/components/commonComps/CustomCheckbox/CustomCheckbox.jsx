import React from "react";
import "./CustomCheckbox.scss"; // Import SCSS for styles

const CustomCheckbox = ({ label, checked, onChange, disabled = false }) => {
  return (
    <div className={`custom-checkbox ${disabled ? "disabled" : ""}`}>
      <input
        type="checkbox"
        id={`checkbox-${label}`}
        className="checkbox-input"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label htmlFor={`checkbox-${label}`} className="checkbox-label">
        <div className="checkbox-custom"></div>
        <p> {label}</p>
      </label>
    </div>
  );
};

export default CustomCheckbox;
