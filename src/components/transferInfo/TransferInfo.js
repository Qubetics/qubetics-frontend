"use-client";
import React from "react";
import "./TransferInformation.scss";
import {
  EXPLORER_CURRENCY_NAME,
  typesOfTransactions,
} from "@/constant/constant";
import CopyText from "../DoCopy/CopyText";
import { capitalizeWord, noExponential } from "@/utils/commonFunctions";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";
import { convertToDateTime } from "@/utils/renderTime";

const TransferInfo = ({ data }) => {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  const tokenTransferedData = data?.input && data?.input;
  const tokenTransferedParsed =
    tokenTransferedData && JSON.parse(tokenTransferedData);
  return (
    <div className="transferinfo">
      <div className="information">
        <p>Status</p>
        {data?.status === "FAILED" ? (
          <span className="failedtrans"> {capitalizeWord(data?.status)} </span>
        ) : data?.status === "SUCCESS" ? (
          <span className="success"> {capitalizeWord(data?.status)} </span>
        ) : (
          "-"
        )}
      </div>
      <div className="information">
        <p>Transaction Hash</p>
        {data?.txhash ? (
          <span>
            {data?.txhash}
            <CopyText text={data?.txhash} hoverText={"hash"} />
          </span>
        ) : (
          "-"
        )}
      </div>
      <div className="information">
        <p>From </p>
        {data?.fromAddress ? (
          <span>
            {data?.fromAddress}
            <CopyText text={data?.fromAddress} />
          </span>
        ) : (
          "-"
        )}
      </div>
      <div className="information">
        <p>To </p>
        {data?.toAddress !== "N/A" && data?.toAddress !== "" ? (
          <span>
            {data?.toAddress}
            {(data?.toAddress?.startsWith("0x") ||
              data?.toAddress?.startsWith("Qubetics")) && (
              <CopyText text={data?.toAddress} />
            )}
          </span>
        ) : data?.contractAddress !== "N/A" && data?.contractAddress !== "" ? (
          <span>
            {data?.contractAddress}
            <CopyText text={data?.contractAddress} />
          </span>
        ) : (
          "-"
        )}
      </div>
      <div className="information">
        <p>Block Number </p>
        <span>
          {data?.blocknumber ? data?.blocknumber : "-"}
          <CopyText text={data?.blocknumber} hoverText={"block"} />
        </span>
      </div>
      <div className="information">
        <p> Amount </p>
        <span>
          {data?.value ? noExponential(data?.value) : "0 "}{" "}
          {" " + EXPLORER_CURRENCY_NAME}
        </span>
      </div>
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
    </div>
  );
};

export default TransferInfo;
