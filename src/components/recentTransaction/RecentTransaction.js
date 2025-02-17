import { Routes, toFixedWithoutRounding } from "@/constant/constant";
import { noExponentsValue } from "@/utils/commonFunctions";
import getAddress from "@/utils/getAddress";
import { renderTime } from "@/utils/renderTime";
import { RightOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { NextArrow } from "../../../public/SvgIcons";
import "../recentBlock/RecentBlock.scss";

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
          <img src="./file.svg" alt="" height={"60"} width={"40"} />
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
              <span style={{ margin: "0 4px" }}>
                <NextArrow />
              </span>
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

        <div className="recentMinAgo">
          <p className="qubeticValue">
            <p>
              {data?.value
                ? toFixedWithoutRounding(
                    noExponentsValue(Number(data?.value)),
                    6
                  )
                : "-"}{" "}
              TICS
            </p>
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
