"use client";
import React from "react";
import "../component.scss";
import "../../index.scss";
import Commonbtn from "../commonbtn/CommonBluebtn";
import CopyText from "../DoCopy/CopyText";


const Heading = ({ heading, button, addresspage, address, onClick }) => {


  return (
    <div className="headerButton">
      <div className="common_header">
        <h2>{heading}</h2>
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
