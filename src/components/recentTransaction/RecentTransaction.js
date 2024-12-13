import React from "react";
import "../recentBlock/RecentBlock.scss";
import getAddress from "@/utils/getAddress";
import { renderTime } from "@/utils/renderTime";
import { Routes } from "@/constant/constant";
import { useRouter } from "next/navigation";
import { RightOutlined } from "@ant-design/icons";

const RecentTransaction = ({ data, customClass }, props) => {
  const router = useRouter();
  return (
    <>
      <div
        className={`recentblocks recentTransaction ${
          customClass ? customClass : ""
        }`}
        {...props}
      >
        <div className="recentdata">
          <img src="./file.svg" alt="" />
          <div>
            <p
              style={{ cursor: "pointer" }}
              onClick={() =>
                router.push(`${Routes.TRANSACTIONS}/${data?.txhash}`)
              }
            >
              {" "}
              {data?.txhash ? getAddress(data?.txhash) : "-"}
            </p>
            <p className="time">
              <span>
                {data?.fromAddress ? getAddress(data?.fromAddress) : "-"}
              </span>
              <RightOutlined />
              <span className="trnxCount">
                {data?.toAddress !== "N/A"
                  ? getAddress(data?.toAddress)
                  : data?.contractAddress
                  ? getAddress(data?.contractAddress)
                  : "-"}
              </span>
            </p>
          </div>
        </div>

        <div>
          <p className="qubeticValue">
            <p>{data?.value ? data?.value : "-"} TICS</p>
          </p>
          <p className="secTime">
            {" "}
            {data?.timestamp ? renderTime(data?.timestamp) : "-"}
          </p>
        </div>
      </div>
    </>
  );
};

export default RecentTransaction;
