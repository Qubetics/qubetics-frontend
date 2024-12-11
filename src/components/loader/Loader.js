"use client";

import { Spin } from "antd";

const Loader = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#181919",
        overflow: "hidden",
        // backgroundColor: isDark ? "#050505" : "#fffff",
        zIndex: 10000000000,
        position: "fixed",
        top: 0,
        left: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "35px",
      }}
    >
      <div className="lottieIcon">
        {/* <Lottie animationData={datajson} loop={true} /> */}
        <Spin size="large" />
      </div>
    </div>
  );
};

export default Loader;
