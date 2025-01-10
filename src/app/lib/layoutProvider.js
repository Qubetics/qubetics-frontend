"use client";
import { useLayoutEffect } from "react";
import dynamic from "next/dynamic";

const Header = dynamic(() => import('@/components/header/header'), { ssr: false })

// import SearchbarComponent from "@/components/search/SearchbarComponent";
import { InitStatus, Routes } from "@/constant/constant";
import { usePathname } from "next/navigation";
// import { useState } from "react";0
import FooterLink from "../../components/footer/FooterLinks";

export default function LayoutProvider({ children }) {
  const pathName = usePathname();
  // const [searchStatus, setSerachStatus] = useState(InitStatus);
  useLayoutEffect(() => {
    if (navigator.userAgent.indexOf("iPhone") > -1) {
      document
        .querySelector("[name=viewport]")
        .setAttribute(
          "content",
          "width=device-width, initial-scale=1, maximum-scale=1"
        );
    }
  }, []);

  return (
    <>
      <div className={`${pathName !== Routes.HOME ? "bgToMainDiv" : ""}`}>
        <Header />
      
        <main className="maininner">
            <div className="addbgtheme" style={{ paddingTop: pathName !== Routes.Welcome && 110 }}>
              {/* <SearchbarComponent
                searchStatus={searchStatus}
                setSerachStatus={setSerachStatus}
              /> */}
            </div>
          {children}
        </main>
        {pathName !== Routes.HOME && <FooterLink />}
      </div>
    </>
  );
}
