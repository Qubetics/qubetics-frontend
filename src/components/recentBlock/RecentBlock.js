import React from "react";
import "./RecentBlock.scss";
import getAddress from "@/utils/getAddress";
import { renderTime } from "@/utils/renderTime";
import { Routes } from "@/constant/constant";
import { useRouter } from "next/navigation";
import "src/components/transferInfo/TransferInformation.scss";
import Link from "next/link";
const RecentBlock = ({ data, customClass }, props) => {
  const router = useRouter();
  return (
    <div
      className={`recentblocks ${customClass ? customClass : ""}`}
      {...props}
    >
      <div className="recentdata">
        <img src="./box.svg" alt="" />
        <div>
          <p
            style={{ cursor: "pointer" }}
            onClick={() =>
              router.push(`${Routes.BLOCK_NO}${data?.blocknumber}`)
            }
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
          style={{ cursor: "pointer" }}
          // onClick={() => router.push(`/address/${data?.miner}`)}
          className="validateSec"
        >
          Validator: &nbsp;
          <Link
            className="validateSec hoverTrans"
            href={`/address/${data?.miner}`}
          >
            {data?.miner ? getAddress(data?.miner) : "-"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RecentBlock;
