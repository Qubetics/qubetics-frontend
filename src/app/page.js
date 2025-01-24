"use client";
// import { useThemeData } from "@/components/contexts/theme_context";
// import SearchbarComponent from "@/components/search/SearchbarComponent";
// import { InitStatus, Routes } from "@/constant/constant";
// import { Grid } from "antd";
// import { usePathname } from "next/navigation";
// import { useRef, useState } from "react";
// import { animated } from "react-spring";
// import "../index.scss";
// import "./(routes)/dashboard/dashboard.scss";
// import Page from "./(routes)/dashboard/page";

export default function Home() {
  // const [classTop, setClassTop] = useState(true);
  // const { showDiv, setShowDiv } = useThemeData();
  // const pathName = usePathname();
  // const [searchStatus, setSerachStatus] = useState(InitStatus);
  // const [focusOnSearch, setFocusOnSearch] = useState(false);
  // const { useBreakpoint } = Grid;
  // const { lg } = useBreakpoint();
  // const scrollDivRef = useRef();

  // useEffect(() => {
  //   if (scrollDivRef.current) {
  //     scrollDivRef.current.scrollTo({ top: 0 });
  //   }
  // }, [showDiv]);

  // const handleScrollRef = () => {
  //   if (scrollDivRef.current) {
  //     const scrollHeight = scrollDivRef.current.scrollHeight;
  //     if (scrollHeight > 100) {
  //       document.body.classList.add("fixHeader");
  //     } else {
  //       document.body.classList.remove("fixHeader");
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (scrollDivRef.current) {
  //     scrollDivRef.current.addEventListener("scroll", handleScrollRef);
  //   }

  //   return () => {
  //     if (scrollDivRef.current) {
  //       scrollDivRef.current.removeEventListener("scroll", handleScrollRef);
  //     }
  //   };
  // }, []);

  // const divAnimation = useSpring({
  //   opacity: showDiv ? 1 : 0,
  // });

  // useLayoutEffect(() => {
  //   showDiv
  //     ? document.body.classList.add("welcomeScreen")
  //     : document.body.classList.add("homeScreen");

  //   return () => {
  //     document.body.classList.remove("welcomeScreen");
  //     document.body.classList.remove("homeScreen");
  //     document.body.classList.remove("fixHeader");
  //   };
  // }, [showDiv]);

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     const handleScroll = () => {
  //       if (!focusOnSearch && !lg) {
  //         if (window.scrollY > 20) {
  //           setShowDiv(true);
  //           setClassTop(false);
  //         }
  //         if (window.scrollY < 20) {
  //           setClassTop(true);
  //         }
  //       }
  //     };
  //     if (!focusOnSearch && !lg) {
  //       window.scrollTo(0, 0);
  //     }

  //     window.addEventListener("scroll", handleScroll);

  //     return () => {
  //       window.removeEventListener("scroll", handleScroll);
  //     };
  //   }
  // }, [focusOnSearch]);

  // useLayoutEffect(() => {
  //   if (navigator.userAgent.indexOf("iPhone") > -1) {
  //     document
  //       .querySelector("[name=viewport]")
  //       .setAttribute(
  //         "content",
  //         "width=device-width, initial-scale=1, maximum-scale=1"
  //       );
  //   }
  // }, []);

  return (
    <>
      <div></div>
      {/* <main>
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
          {/* <animated.div
            className={`animated-div ${!showDiv ? "transition" : "transit"}`}
          >
            <video
              playsInline
              autoPlay
              muted
              loop
              type="video/mp4"
              className="video_home"
            >
              <source
                src={`${EXPLORER_VIDEO_LINKS}Bg_Video.mp4`}
                type="video/mp4"
              />
            </video>

            <video
              playsInline
              autoPlay
              muted
              loop
              type="video/mp4"
              className="video_home lightvideo"
            >
              <source
                src={`${EXPLORER_VIDEO_LINKS}BG_Video2_lite.mp4`}
                type="video/mp4"
              />
            </video>

            <div className="welcome_sec">
              <div>
                <Image
                  src="/logoqubetics.svg"
                  className="welcomeLogo"
                  height={157}
                  width={137}
                  alt="logo"
                />
                <h3>{EXPLORER_CHAIN_NAME} - Blockchain Explorer</h3>
              </div>
            </div>
          </animated.div> */}
      {/* </section>
      </main> *
      
      /} */}
    </>
  );
}
