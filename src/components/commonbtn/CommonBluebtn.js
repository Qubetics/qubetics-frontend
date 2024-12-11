import React from "react";

const Commonbtn = ({ text, onClick, type, Lefticon, rightIcon, disabled,className }) => {
  return (
    <button
      type={type}
      lefticon={Lefticon}
      righticon={rightIcon}
      onClick={onClick}
      disabled={disabled}
      className={`${className} bluebtn`}
    >
      {text}
    </button>
  );
};

export default Commonbtn;
