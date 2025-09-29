import React from "react";
import "./RecentBlock.scss";
import getAddress from "@/utils/getAddress";
import { renderTime } from "@/utils/renderTime";
import { Routes } from "@/constant/constant";
import { useRouter } from "next/navigation";
import "../transferInfo/TransferInformation.scss";
import Link from "next/link";
import { trackEvent } from "@/utils/eventTrack";
const RecentBlock = ({ data, customClass }, props) => {
  const router = useRouter();

  return (
    <div
      className={`recentblocks ${customClass ? customClass : ""}`}
      {...props}
    >
      <div className="recentdata">
        <img src="./box.svg" alt="" height={"60"} width={"40"} />
        <div className="recentdata_inner">
          <p
            style={{ cursor: "pointer" }}
            onClick={() => (
              trackEvent({
                category: "Block",
                action: "Block Number",
                label: data?.blocknumber,
              }),
              router.push(`${Routes.BLOCK_NO}${data?.blocknumber}`)
            )}
            className="recenteBlockNumber"
          >
            {" "}
            {data?.blocknumber ? data?.blocknumber : "-"}
          </p>
          <p className="time">
            {data?.timestamp ? renderTime(data?.timestamp) : "-"}
          </p>
        </div>
      </div>
      <div className="recent recentCenter">
        <p>
          <span className="trnxCount">
            {data?.transactionCount ? data?.transactionCount : 0} txn
          </span>{" "}
        </p>
        <p>{data?.timestamp ? renderTime(data?.timestamp) : "-"}</p>
      </div>
      <div className="recent validatorAddress">
        <p
          // style={{ cursor: "pointer" }}
          // onClick={() => router.push(`/address/${data?.miner}`)}
          className="validateSec"
        >
          Validator: &nbsp;
          {/* <Link className=" hoverTrans" href={`/address/${data?.miner}`}> */}
          <p>{data?.miner ? getAddress(data?.miner) : "-"}</p>
        </p>
        {/* </Link> */}
      </div>
    </div>
  );
};

export default RecentBlock;
