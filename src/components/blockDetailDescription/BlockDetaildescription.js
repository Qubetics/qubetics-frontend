import { Routes } from "@/constant/constant";
import { convertToDateTime, renderTime } from "@/utils/renderTime";
import Link from "next/link";
import CopyText from "../DoCopy/CopyText";
import "../transferInfo/TransferInformation.scss";

const BlockDetailDescription = ({ blockData, status }) => {
  let chain =
    typeof window !== "undefined" && localStorage.getItem("chainType");
  console.log(blockData, "blockData");

  return (
    <div className="blockdescription mt-20">
      {/* {status === InitStatus || status === FetchingStatus ? (
        <Loader />
      ) : status === SuccessStatus ? ( */}
      <div className="transferinfo blockinform">
        <div className="information">
          <p> Block Hash </p>
          {blockData?.blockhash || blockData?.block?.blockhash ? (
            <span className="hoverTrans">
              {blockData?.blockhash
                ? blockData?.blockhash
                : blockData?.block?.blockhash}
              <CopyText
                hoverText={"hash"}
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
          <p>Block Number</p>
          <span className="hoverTrans">
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
          <p>Validator </p>
          {blockData?.miner || blockData?.block?.miner ? (
            // onClick={() => router.push(`${Routes.Tx_ADDRESS}/${blockData?.miner}`)
            <span className="">
              {/* <Link
                className="hoverTrans"
                href={`${Routes.Tx_ADDRESS}/${
                  blockData?.miner ? blockData?.miner : blockData?.block?.miner
                }`}
              > */}
              {blockData?.miner ? blockData?.miner : blockData?.block?.miner}
              {/* </Link> */}
              {/* <CopyText
                text={
                  blockData?.miner ? blockData?.miner : blockData?.block?.miner
                }
              /> */}
            </span>
          ) : (
            "-"
          )}
        </div>
        <div className="information">
          <p>Timestamp </p>
          <span className="">
            {blockData?.timestamp ? (
              <span>
                {convertToDateTime(blockData?.timestamp)}
                <span>{renderTime(blockData?.timestamp)} </span>
              </span>
            ) : blockData?.block?.timestamp ? (
              <span className="realTime">
                {convertToDateTime(blockData?.block?.timestamp)}
                <span>{`| ${renderTime(blockData?.block?.timestamp)}`}</span>
              </span>
            ) : (
              "-"
            )}
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
          <p> Txn Count </p>
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
        {chain == "EVM Chain" && (
          <div className="information">
            <p> Base Fee Per Gas </p>
            <span className="">
              {blockData?.block?.baseFeePerGas
                ? blockData?.block?.baseFeePerGas
                : 0}
            </span>
          </div>
        )}
        {chain == "EVM Chain" && (
          <div className="information">
            <p> Nonce </p>
            <span className="">
              {blockData?.block?.nonce ? blockData?.block?.nonce : 0}
            </span>
          </div>
        )}
        {chain == "EVM Chain" && (
          <div className="information">
            <p> Transfer </p>
            <span className="">
              {blockData?.block?.transfer ? blockData?.block?.transfer : 0}
            </span>
          </div>
        )}
        {chain == "EVM Chain" && (
          <div className="information">
            <p> Gas Limit </p>
            <span className="">
              {blockData?.block?.gasLimit ? blockData?.block?.gasLimit : 0}
            </span>
          </div>
        )}
        <div className="information">
          <p> Parent Hash </p>
          <span className="">
            <Link
              className="hoverTrans"
              href={`${Routes.BLOCKS}/${blockData?.block?.parentHash}`}
            >
              {blockData?.block?.parentHash
                ? blockData?.block?.parentHash
                : "-"}
            </Link>

            <CopyText text={blockData?.block?.parentHash} />
          </span>
        </div>
        <div className="information">
          <p> Transactions Root </p>
          <span className="">
            <span>
              {blockData?.block?.transactionsRoot
                ? blockData?.block?.transactionsRoot
                : "-"}
            </span>
          </span>
        </div>
        <div className="information">
          <p> Receipts Root </p>
          <span className="">
            <span>
              {blockData?.block?.receiptsRoot
                ? blockData?.block?.receiptsRoot
                : "-"}
            </span>
          </span>
        </div>
        <div className="information">
          <p> State Root </p>
          <span className="">
            <span>
              {blockData?.block?.stateRoot ? blockData?.block?.stateRoot : "-"}
            </span>
          </span>
        </div>
      </div>

      {/* ) : (
        <Page />
      )} */}
    </div>
  );
};

export default BlockDetailDescription;
