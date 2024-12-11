"use client";
import React, { useRef, useState } from "react";
import "../component.scss";
import "../../index.scss";
import Commonbtn from "../commonbtn/CommonBluebtn";
import CopyText from "../DoCopy/CopyText";
import SearchbarComponent from "../search/SearchbarComponent";
import { InitStatus, Routes } from "@/constant/constant";
import { useThemeData } from "../contexts/theme_context";
import { usePathname } from "next/navigation";
import { animated } from "react-spring";
import Page from "@/app/(routes)/dashboard/page";

const Heading = ({ heading, button, addresspage, address, onClick }) => {
  const { showDiv, setShowDiv } = useThemeData();
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [focusOnSearch, setFocusOnSearch] = useState(false);
  const scrollDivRef = useRef();
  const pathName = usePathname();

  return (
    <div className="headerButton">
      <div className="common_header">
        <h2>{heading}</h2>
      </div>
      {/* <div>
        <div>
          {pathName !== Routes.DASHBOARD ? (
            <SearchbarComponent
              searchStatus={searchStatus}
              setSerachStatus={setSerachStatus}
              // onFocus={() => setFocusOnSearch(!showDiv && true)}
              // onBlur={() => setFocusOnSearch(!showDiv && false)}
            />
          ) : (
            ""
          )}
        </div>
      </div> */}
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
