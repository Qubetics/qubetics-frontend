import React from "react";
import "../transferInfo/TransferInformation.scss";
import { renderTime } from "@/utils/renderTime";
import CopyText from "../DoCopy/CopyText";
import { FetchingStatus, InitStatus, SuccessStatus } from "@/constant/constant";
import Loader from "../loader/Loader";
import Page from "@/app/(routes)/notfound/page";

const BlockDetailDescription = ({ blockData, status }) => {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");

  return (
    <div className="blockdescription">
      {status === InitStatus || status === FetchingStatus ? (
        <Loader />
      ) : status === SuccessStatus ? (
        <div className="transferinfo blockinform">
          <div className="information">
            <p>Block Number</p>
            <span className="">
              {blockData?.blocknumber
                ? blockData?.blocknumber
                : blockData?.block?.blocknumber
                ? blockData?.block?.blocknumber
                : "-"}
              <CopyText
                text={
                  blockData?.blocknumber
                    ? blockData?.blocknumber
                    : blockData?.block?.blocknumber
                    ? blockData?.block?.blocknumber
                    : "-"
                }
                hoverText={"block"}
              />
            </span>
          </div>
          <div className="information">
            <p> Block Hash </p>
            {blockData?.blockhash || blockData?.block?.blockhash ? (
              <span className="">
                {blockData?.blockhash
                  ? blockData?.blockhash
                  : blockData?.block?.blockhash}
                <CopyText
                  text={
                    blockData?.blockhash
                      ? blockData?.blockhash
                      : blockData?.block?.blockhash
                  }
                />
              </span>
            ) : (
              "-"
            )}
          </div>
          <div className="information">
            <p>Validator </p>
            {blockData?.miner || blockData?.block?.miner ? (
              <span className="">
                {blockData?.miner ? blockData?.miner : blockData?.block?.miner}
                <CopyText
                  text={
                    blockData?.miner
                      ? blockData?.miner
                      : blockData?.block?.miner
                  }
                />
              </span>
            ) : (
              "-"
            )}
          </div>
          <div className="information">
            <p>Age </p>
            <span className="">
              {blockData?.timestamp
                ? renderTime(blockData?.timestamp)
                : blockData?.block?.timestamp
                ? renderTime(blockData?.block?.timestamp)
                : "-"}
            </span>
          </div>
          {chain == "EVM Chain" && (
            <div className="information">
              <p>Weight</p>
              <span className="">
                {blockData?.block?.size ? blockData?.block?.size : "-"}
              </span>
            </div>
          )}
          <div className="information">
            <p> Tx Count </p>
            <span className="">
              {blockData?.transactionCount
                ? blockData?.transactionCount
                : blockData?.block?.transactionCount
                ? blockData?.block?.transactionCount
                : 0}
            </span>
          </div>
          {chain == "EVM Chain" && (
            <div className="information">
              <p> Gas Used </p>
              <span className="">
                {blockData?.block?.gasUsed ? blockData?.block?.gasUsed : 0}
              </span>
            </div>
          )}
        </div>
      ) : (
        <Page />
      )}
    </div>
  );
};

export default BlockDetailDescription;
