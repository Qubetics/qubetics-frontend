"use client";
import { useThemeData } from "@/components/contexts/theme_context";
import SearchbarComponent from "@/components/search/SearchbarComponent";
import { InitStatus, Routes } from "@/constant/constant";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import "../index.scss";
import "./(routes)/dashboard/dashboard.scss";
import Page from "./(routes)/dashboard/page";

export default function Home() {
  const { showDiv, setShowDiv } = useThemeData();
  const pathName = usePathname();
  const [searchStatus, setSerachStatus] = useState(InitStatus);
  const [focusOnSearch, setFocusOnSearch] = useState(false);
  const scrollDivRef = useRef();


  return (
    <>
      <main>
        <section
          className={`landing_main`}
          ref={scrollDivRef}
          style={{ overflow: !showDiv ? "unset" : "auto" }}
        >
          <div>
            {pathName === Routes.DASHBOARD ? (
              <div className="container">
                <SearchbarComponent
                  searchStatus={searchStatus}
                  setSerachStatus={setSerachStatus}
                  onFocus={() => setFocusOnSearch(!showDiv && true)}
                  onBlur={() => setFocusOnSearch(!showDiv && false)}
                />
              </div>
            ) : (
              ""
            )}
            {!focusOnSearch ? (
              <animated.div className="animated-div">
                <Page customClass={"animatedPageScroll"} />
              </animated.div>
            ) : (
              ""
            )}
          </div>
        </section>
      </main>
    </>
  );
}
