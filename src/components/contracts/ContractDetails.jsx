import Page from "@/app/(routes)/notfound/page";
import {
  FetchingStatus,
  InitStatus,
  Routes,
  SuccessStatus,
} from "@/constant/constant";
import { capitalizeWord } from "@/utils/commonFunctions";
import getAddress from "@/utils/getAddress";
import { convertToDateTime } from "@/utils/renderTime";
import Link from "next/link";
import CopyText from "../DoCopy/CopyText";
import "../transferInfo/TransferInformation.scss";
import { Tooltip } from "antd";

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
                  <span className="copyText   ">
                    {data?.address ? (
                      <>
                        <Tooltip title={data?.address}>
                          {getAddress(data?.address)}
                        </Tooltip>
                      </>
                    ) : (
                      "-"
                    )}
                  </span>
                  <CopyText text={data?.address} />
                </h6>
              </div>
              <div className="information">
                <p>Type </p>
                <span className="">
                  {data?.contractType ? data?.contractType : "-"}
                </span>
              </div>
              <div className="information">
                <p>Balance </p>
                <span className="">{data?.balance || 0} TICS</span>
              </div>
              <div className="information">
                <p> Creator </p>
                <h6>
                  <Link href={`/address/${data?.creator}`}>
                    <span className="copyText hoverTrans">
                      {data?.creator ? (
                        <>
                          <Tooltip title={data?.creator}>
                            {getAddress(data?.creator)}
                          </Tooltip>
                        </>
                      ) : (
                        "-"
                      )}
                    </span>
                  </Link>
                  <CopyText text={data?.creator} />
                </h6>
              </div>
            </div>
            <div className="inner">
              <div className="information">
                <p>Last Executed At</p>
                <span className="">
                  {data?.updatedAt ? convertToDateTime(data?.updatedAt) : "-"}
                </span>
              </div>
              <div className="information">
                <p>Deployed At</p>
                <span className="">
                  {data?.createdAt ? convertToDateTime(data?.createdAt) : "-"}
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
                    {data?.txHash ? (
                      <Link
                        className="hoverTrans"
                        href={`${Routes.Tx_Hash}${data?.txHash}`}
                      >
                        <Tooltip title={data?.txHash}>
                          {getAddress(data?.txHash)}
                        </Tooltip>
                      </Link>
                    ) : (
                      "-"
                    )}
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
