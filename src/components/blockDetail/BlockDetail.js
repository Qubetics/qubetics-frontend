"use client";
import React from "react";

const BlockDetail = ({ details, centerBlocks }) => {
  return (
    <div className={`blockdetail ${centerBlocks ? "centerBlocks" : ""}`}>
      {details?.map((detail, index) => (
        <div key={index} className="innerdata">
          <div className="imgIcon">{detail?.img}</div>
          <div>
            <p>{detail?.text}</p>
            <h2>{detail?.heading}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};
export default BlockDetail;
