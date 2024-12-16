"use client";
import Commonbtn from "@/components/commonbtn/CommonBluebtn";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { InitStatus } from "@/constant/constant";
import { useState } from "react";
import { Datnotfound } from "../../../../public/SvgIcons";
import "../blocks/blocksummary.scss";
import "./pagenotfund.scss";

function Page({ dashnotfound }) {
  const [searchStatus, setSerachStatus] = useState(InitStatus);

  return (
    <div className="container">
      <SearchbarComponent
        searchStatus={searchStatus}
        setSerachStatus={setSerachStatus}
      />
      <div
        className={`blocksummary ${dashnotfound ? "dashnotfound" : "notfound"}`}
      >
        <div>
          <Datnotfound />
          <p style={{ color: "white" }}>Data Not Found</p>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <Commonbtn
          onClick={() => (window.location.href = "/")}
          style={{ width: "200px" }}
          text={"Go To Dashboard"}
        />
      </div>
    </div>
  );
}

export default Page;
