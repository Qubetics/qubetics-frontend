import React from "react";
import "../transferInfo/TransferInformation.scss";
import CopyText from "../DoCopy/CopyText";
import { formatDate } from "@/utils/renderTime";
import { FetchingStatus, InitStatus, SuccessStatus } from "@/constant/constant";
import Page from "@/app/(routes)/notfound/page";
import { capitalizeWord } from "@/utils/commonFunctions";

const ContractDetails = ({ data, status }) => {
  return (
    <div className="blockdescription">
      {status === InitStatus || status === FetchingStatus ? (
        <Loader />
      ) : status === SuccessStatus ? (
        <div className="transferinfo blockinform contractDetailsCard">
          <div className="information topheading">
            <h3>Overview</h3>
          </div>
          <div className="detailInner">
            <div className="inner">
              <div className="information">
                <p>Name</p>
                <span className="">
                  {data?.contractName
                    ? capitalizeWord(data?.contractName)
                    : "-"}
                </span>
              </div>
              <div className="information">
                <p> Contract Address </p>

                <h6>
                  <span className="copyText">
                    {data?.address ? <>{data?.address}</> : "-"}
                  </span>
                  <CopyText text={data?.address} />
                </h6>
              </div>
              <div className="information">
                <p>Type </p>
                <span className="">
                  {data?.contractType
                    ? capitalizeWord(data?.contractType)
                    : "-"}
                </span>
              </div>
              <div className="information">
                <p>Balance </p>
                <span className="">400 TICS</span>
              </div>
              <div className="information">
                <p> Creator </p>
                <h6>
                  <span className="copyText">
                    {data?.creator ? <>{data?.creator}</> : "-"}
                  </span>
                  <CopyText text={data?.creator} />
                </h6>
              </div>
            </div>
            <div className="inner">
              <div className="information">
                <p>Last Executed At</p>
                <span className="">
                  {data?.updatedAt ? formatDate(data?.updatedAt) : "-"}
                </span>
              </div>
              <div className="information">
                <p>Deployed At</p>
                <span className="">
                  {data?.createdAt ? formatDate(data?.createdAt) : "-"}
                </span>
              </div>
              <div className="information">
                <p>Internal Transactions Count </p>
                <span className="">{data?.txCount ? data?.txCount : "0"}</span>
              </div>
              <div className="information">
                <p> Transaction Hash </p>

                <h6>
                  <span className="copyText">
                    {data?.txHash ? <>{data?.txHash}</> : "-"}
                  </span>
                  <CopyText text={data?.txHash} hoverText={"hash"} />
                </h6>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Page />
      )}
    </div>
  );
};

export default ContractDetails;
