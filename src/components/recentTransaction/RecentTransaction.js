import { Routes } from "@/constant/constant";
import getAddress from "@/utils/getAddress";
import { renderTime } from "@/utils/renderTime";
import { useRouter } from "next/navigation";
import { NextArrow } from "../../../public/SvgIcons";
import "../recentBlock/RecentBlock.scss";
import { formatValueByChain } from "../header/helper";

const RecentTransaction = ({ data, customClass, isEvm }, props) => {
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
          <img src="./file.svg" alt="" height={"60"} width={"40"} />
          <div>
            <p
              style={{ cursor: "pointer" }}
              onClick={() =>
                router.push(
                  `${Routes.TRANSACTIONS}/${isEvm ? data?.hash : data?.txhash}`
                )
              }
            >
              {" "}
              {data?.hash || data?.txhash
                ? getAddress(data?.hash || data?.txhash)
                : "-"}
            </p>
            <p className="time">
              <span>
                {data?.fromAddress || data?.from?.hash
                  ? getAddress(data?.fromAddress || data?.from?.hash)
                  : "-"}
              </span>
              <span style={{ margin: "0 4px" }}>
                <NextArrow />
              </span>
              <span className="trnxCount">
                {data?.toAddress || data?.to?.hash !== "N/A"
                  ? getAddress(data?.toAddress || data?.to?.hash)
                  : data?.contractAddress
                  ? getAddress(data?.contractAddress)
                  : "-"}
              </span>
            </p>
          </div>
        </div>

        <div className="recentMinAgo">
          <p className="qubeticValue">
            <p>{formatValueByChain(data?.value, isEvm)}</p>
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
