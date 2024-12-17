"use client";
import Commonbtn from "@/components/commonbtn/CommonBluebtn";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { InitStatus, Routes } from "@/constant/constant";
import { useState } from "react";
import { Datnotfound } from "../../../../public/SvgIcons";
import "../blocks/blocksummary.scss";
import "./pagenotfund.scss";
import { usePathname } from "next/navigation";

function Page({ dashnotfound }) {
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const pathname = usePathname();
  return (
    <div className="container">
      {pathname === Routes.NOT_FOUND && (
        <SearchbarComponent
          searchStatus={searchStatus}
          setSerachStatus={setSerachStatus}
        />
      )}
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
        {pathname === Routes.NOT_FOUND && (
          <Commonbtn
            onClick={() => (window.location.href = "/")}
            style={{ width: "200px" }}
            text={"Go To Dashboard"}
          />
        )}
      </div>
    </div>
  );
}

export default Page;
