"use client";
import React from "react";
import "../component.scss";
import "../../index.scss";
import Commonbtn from "../commonbtn/CommonBluebtn";
import CopyText from "../DoCopy/CopyText";

const Heading = ({
  heading,
  button,
  addresspage,
  address,
  onClick,
  status,
}) => {
  const renderStatus = (status) => {
    if (!status) return null;

    const color = status === "active" ? "green" : "red";
    const text = status === "active" ? "Active" : "Inactive";
    return (
      <span
        style={{
          color,
          fontWeight: 600,
          fontSize: "16px",
          marginLeft: "15px",
          padding: "4px 8px",
          border: "1px solid #3b393c",
          borderRadius: "14px",
          backgroundColor: color === "green" ? "#121212" : "#121212",
        }}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="headerButton">
      <div className="common_header">
        <h2>
          {heading}
          {status && renderStatus(status)}
        </h2>
      </div>

      {button ? <Commonbtn text="View All" onClick={onClick} /> : ""}
      {addresspage && address ? (
        <div className="addresspage">
          <div>
            <span>Address </span>
            <p> {address}</p>
          </div>
          <CopyText text={address} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Heading;
