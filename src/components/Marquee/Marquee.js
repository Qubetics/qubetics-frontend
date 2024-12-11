import React from "react";
import "./Marquee.scss";
import { Banner } from "@/constant/constant";
function Marquee() {
  return (
    <article className="main-container__marquee">
      <div className="main-container__marquee-track">
        <div className="main-container__marquee-items">
          <span className="main-container__marquee-item">{Banner} </span>
          <span className="main-container__marquee-item">{Banner}</span>
          <span className="main-container__marquee-item">{Banner}</span>
          <span className="main-container__marquee-item">{Banner}</span>
          <span className="main-container__marquee-item">{Banner}</span>
          {/* <span className="main-container__marquee-item">
            USDC is Coming Soon on Qubetics Chain !
            </span> */}
        </div>
        <div aria-hidden="true" className="main-container__marquee-items">
          <span className="main-container__marquee-item">{Banner}</span>
          <span className="main-container__marquee-item">{Banner}</span>
          <span className="main-container__marquee-item">{Banner}</span>
          <span className="main-container__marquee-item">{Banner}</span>
          <span className="main-container__marquee-item">{Banner}</span>
          {/* <span className="main-container__marquee-item">
            USDC is Coming Soon on Qubetics Chain !
          </span> */}
        </div>
      </div>
    </article>
  );
}

export default Marquee;
