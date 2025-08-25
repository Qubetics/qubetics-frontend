import React from "react";
import "./RecentBlock.scss";
import getAddress from "@/utils/getAddress";
import { renderTime } from "@/utils/renderTime";
import { Routes } from "@/constant/constant";
import { useRouter } from "next/navigation";
import "../transferInfo/TransferInformation.scss";
import { trackEvent } from "@/utils/eventTrack";
const RecentBlock = ({ data, customClass }, props) => {
  const miner = data?.miner?.hash || data?.miner;
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
                label: data?.blocknumber || data?.height,
              }),
              router.push(
                `${Routes.BLOCK_NO}${data?.blocknumber || data?.height}`
              )
            )}
            className="recenteBlockNumber"
          >
            {" "}
            {data?.blocknumber || data?.height
              ? data?.blocknumber || data?.height
              : "-"}
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
          <p>{miner ? getAddress(miner) : "-"}</p>
        </p>
        {/* </Link> */}
      </div>
    </div>
  );
};

export default RecentBlock;
