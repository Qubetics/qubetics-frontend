import React from "react";

const Commonbtn = ({ text, onClick, type, Lefticon, rightIcon, disabled,className,style }) => {
  return (
    <button
      type={type}
      style={style}
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
