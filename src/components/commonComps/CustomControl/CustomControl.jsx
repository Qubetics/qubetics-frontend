import React from "react";
import "./CustomControl.scss";

const CustomControl = ({ type, id, name, value, checked, onChange, label }) => {
  return (
    <div className="custom-control">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id} className="custom-control-label">
        {label}
      </label>
    </div>
  );
};

export default CustomControl;
