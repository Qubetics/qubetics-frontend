import React from "react";
import { Datnotfound } from "../../../../public/SvgIcons";
import "../blocks/blocksummary.scss";
import "./pagenotfund.scss";

function Page({ dashnotfound }) {
  return (
    <div
      className={`blocksummary ${dashnotfound ? "dashnotfound" : "notfound"}`}
    >
      <div>
        {" "}
        <Datnotfound />
        <p style={{ color: "white" }}>Data Not Found</p>
      </div>
    </div>
  );
}

export default Page;
