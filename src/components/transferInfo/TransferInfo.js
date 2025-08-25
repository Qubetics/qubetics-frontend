"use-client";
import LatestTxIcon from "@/assets/svg/svgs";
import { EXPLORER_CURRENCY_NAME } from "@/constant/constant";
import {
  capitalizeWord,
  formatMillionNumber,
  noExponential,
} from "@/utils/commonFunctions";
import { convertToDateTime, renderTime } from "@/utils/renderTime";
import Link from "next/link";
import CopyText from "../DoCopy/CopyText";
import "./TransferInformation.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { formatValueByChain, handleStatus } from "../header/helper";

const TransferInfo = ({
  data,
  internalTxns,
  internalTxnCount,
  setTab,
  isEvm,
}) => {
  const searchParam = useSearchParams();
  const result = data.status || data?.result;
  const router = useRouter();
  const internalTransaction =
    internalTxnCount > 10 ? internalTxns.slice(0, 10) : internalTxns;

  const handleTabSelect = (e) => {
    setTab("2");
    const newSearchParams = new URLSearchParams(searchParam);
    newSearchParams.set("tab", "2");
    router.replace(`?${newSearchParams.toString()}`, {
      shallow: true,
      scroll: false,
    });
  };
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  const tokenTransferedData = data?.input && data?.input;
  const tokenTransferedParsed =
    tokenTransferedData && JSON.parse(tokenTransferedData);
  return (
    <div className="doubleCardTranfer">
      <div className="transferinfo">
        <div className="information">
          <p>Status</p>
          {handleStatus(result)}
        </div>
        <div className="information">
          <p>Transaction Hash</p>
          {data?.hash || data?.txhash ? (
            <span>
              {/* <Link href={`/tx/${data?.hash || data?.txhash}`} className=""> */}
              {data?.hash || data?.txhash}
              {/* </Link> */}
              <CopyText text={data?.hash || data?.txhash} hoverText={"hash"} />
            </span>
          ) : (
            "-"
          )}
        </div>
        <div className="information">
          <p>From </p>
          {data?.from?.hash || data?.fromAddress ? (
            <span>
              <Link
                className="hoverTrans"
                href={`/address/${data?.from?.hash || data?.fromAddress}`}
              >
                {" "}
                {data?.from?.hash || data?.fromAddress}
              </Link>

              <CopyText text={data?.from?.hash || data?.fromAddress} />
            </span>
          ) : (
            "-"
          )}
        </div>
        <div className="information">
          <p style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            {data?.transaction_types?.includes("contract_call")
              ? "Interacted with Contract"
              : "To"}
            {data?.transaction_types?.includes("contract_call") && (
              <LatestTxIcon />
            )}
          </p>

          {data?.to?.hash ||
          (data?.toAddress !== "N/A" && data?.to?.hash) ||
          data?.toAddress !== "" ? (
            <span>
              <Link
                className="hoverTrans"
                href={
                  data?.transaction_types?.includes("contract_call")
                    ? `/contract/${data?.to?.hash || data?.toAddress}`
                    : `/address/${data?.to?.hash || data?.toAddress}`
                }
              >
                {data?.to?.hash || data?.toAddress}
              </Link>
              <CopyText text={data?.to?.hash || data?.toAddress} />
            </span>
          ) : data?.contractAddress !== "N/A" &&
            data?.contractAddress !== "" ? (
            <span className="hoverTrans">
              <Link href={`/contract/${data?.contractAddress}`}>
                {data?.contractAddress}
              </Link>
              <CopyText text={data?.contractAddress} />
            </span>
          ) : (
            "-"
          )}
        </div>
        {internalTransaction && internalTransaction.length > 0 ? (
          <div className="information">
            <p className="section-title">
              <i className="fas fa-info-circle"></i> Internal Transactions
            </p>

            <div className="internal-list">
              {internalTransaction.slice(0, 10).map((item, index) => {
                const ticsvalue = formatValueByChain(item.value, isEvm);
                // const usdValue = `$${(ticsvalue * 4000).toFixed(2)}`; // Static rate, replace with live API
                return (
                  <div className="internal-item" key={index}>
                    <i className="fas fa-caret-right text-muted"></i>
                    <strong className="transfer-label">{item?.method}</strong>
                    <span className="eth-value">{ticsvalue} Tics </span>
                    {/* <span className="usd-value">({usdValue})</span> */}
                    <span>From</span>
                    <Link
                      style={{ color: "#A0A0A0" }}
                      className="hoverTrans"
                      href={`/address/${item?.from?.hash}`}
                      title={item?.from?.hash}
                    >
                      {item?.from?.hash.slice(0, 6)}...
                      {item?.from?.hash.slice(-4)}
                    </Link>

                    <span>To</span>
                    <Link
                      style={{ color: "#A0A0A0" }}
                      className="hoverTrans"
                      href={`/address/${item?.to?.hash}`}
                      title={item?.to?.hash}
                    >
                      {item?.to?.hash.slice(0, 6)}...{item?.to?.hash.slice(-4)}
                    </Link>
                  </div>
                );
              })}
              {internalTxnCount > 10 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    backgroundColor: "transparent",
                  }}
                  className=""
                >
                  <button
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      color: "white",
                    }}
                    onClick={() => handleTabSelect("internal")}
                    className="text-blue-500 hover:underline"
                  >
                    More &raquo;
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          "-"
        )}

        <div className="information">
          <p>Block Number </p>
          {data?.block_number || data?.blocknumber ? (
            <span>
              <Link
                className="hoverTrans"
                href={`/blocks/${data?.block_number || data?.blocknumber}`}
              >
                {data?.block_number || data?.blocknumber}
              </Link>
              <CopyText
                text={data?.block_number || data?.blocknumber}
                hoverText={"block"}
              />
            </span>
          ) : (
            "-"
          )}
        </div>
        <div className="information">
          <p> Amount </p>
          <span>
            {data?.value ? formatValueByChain(data?.value) : "0 "}{" "}
            {" " + EXPLORER_CURRENCY_NAME.toLocaleUpperCase()}
          </span>
        </div>
      </div>
      <div className="transferinfo">
        <div className="information">
          <p>Timestamp</p>
          {data?.timestamp ? (
            <span className="realTime">
              {convertToDateTime(data?.timestamp)},
              <span className="secondAgo"> {renderTime(data?.timestamp)}</span>
            </span>
          ) : data?.createdAt ? (
            <span className="timestamp">
              {convertToDateTime(data?.createdAt)}
              <span> {renderTime(data?.createdAt)}</span>
            </span>
          ) : (
            "-"
          )}
        </div>

        <div className="information">
          <p> Fee </p>

          <span>
            {data?.fee?.value || data?.txFee
              ? formatValueByChain(data?.txFee || data?.fee?.value)
              : "0"}{" "}
            {EXPLORER_CURRENCY_NAME.toLocaleUpperCase()}
          </span>
        </div>
        <div className="information">
          <p> Method</p>
          <span>
            {data?.method || data?.transaction_types[0]
              ? capitalizeWord(data?.method || data?.transaction_types[0])
              : "-"}
          </span>
        </div>
        {
          // chain == "EVM Chain" && (
          <div className="information">
            <p>Gas Used </p>
            <span>
              {data?.gas_used || data?.gasUsed
                ? data?.gas_used || data?.gasUsed
                : "0"}
            </span>
          </div>
          // )
        }

        {/* {tokenTransferedParsed?.name == "transfer" && (
          <div className="information ">
            <p>Tokens transferred </p>
            <h5 className="innerDetail">
              <span className="linkBg ">
                <Link
                  href={`/address/${data?.fromAddress}`}
                  className="hoverTrans"
                >
                  {" "}
                  {data?.fromAddress}{" "}
                </Link>
                <CopyText text={data?.fromAddress} />
              </span>

              <ArrowRightOutlined />
              <span className="linkBg">
                <Link
                  href={`/address/${tokenTransferedParsed?.params[0]?.value}`}
                  className="hoverTrans"
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
        )} */}
        {/* <div className="information">
          <p>Event Logs </p>
          <span>5124526</span>
        </div> */}
      </div>
    </div>
  );
};

export default TransferInfo;
