import React from "react";
import "../transferInfo/TransferInformation.scss";
import { EXPLORER_CURRENCY_NAME } from "@/constant/constant";
import { capitalizeWord, noExponential } from "@/utils/commonFunctions";
import { convertToDateTime } from "@/utils/renderTime";
import { ArrowRightOutlined } from "@ant-design/icons";
import Link from "next/link";
import CopyText from "../DoCopy/CopyText";

const TransactionDetails = ({ data }) => {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  const tokenTransferedData = data?.input && data?.input;
  const tokenTransferedParsed =
    tokenTransferedData && JSON.parse(tokenTransferedData);

  return (
    <div className="transferinfo">
      <div className="information">
        <p>Timestamp</p>
        <span>
          {data?.timestamp
            ? convertToDateTime(data?.timestamp)
            : data?.createdAt
            ? convertToDateTime(data?.createdAt)
            : "-"}
        </span>
      </div>
      <div className="information">
        <p> Fee </p>
        <span>
          {data?.txFee ? noExponential(Number(data?.txFee)) : "0"}{" "}
          {EXPLORER_CURRENCY_NAME}
        </span>
      </div>
      <div className="information">
        <p> Method</p>
        <span>{data?.type ? capitalizeWord(data?.type) : "-"}</span>
      </div>
      {chain == "EVM Chain" && (
        <div className="information">
          <p>Gas Used </p>
          <span>{data?.gas ? data?.gas : "0"}</span>
        </div>
      )}

      {tokenTransferedParsed?.name == "transfer" && (
        <div className="information ">
          <p>Tokens transferred </p>
          <h5 className="innerDetail">
            <span className="linkBg">
              <Link href={`/address/${data?.fromAddress}`}>
                {" "}
                {data?.fromAddress}{" "}
              </Link>
              <CopyText text={data?.fromAddress} />
            </span>

            <ArrowRightOutlined />
            <span className="linkBg">
              <Link
                href={`/address/${tokenTransferedParsed?.params[0]?.value}`}
              >
                {tokenTransferedParsed?.params[0]?.value}{" "}
              </Link>
              <CopyText text={tokenTransferedParsed?.params[0]?.value} />
            </span>
            <span>for</span>
            <span>{tokenTransferedParsed?.params[1]?.value}</span>
            <span className="linkBg">
              <span>
                {data?.tokenInfo?.tokenSymbol
                  ? data?.tokenInfo?.tokenSymbol
                  : ""}{" "}
              </span>
            </span>
          </h5>
        </div>
      )}
      <div className="information hide">
        <p>Block </p>
        <span>5124526</span>
      </div>
    </div>
  );
};

export default TransactionDetails;
