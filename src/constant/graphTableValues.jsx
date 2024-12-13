"use-client";
import Link from "next/link";
import { convertToDateTime, formatDate, renderTime } from "@/utils/renderTime";
import getAddress, { imgUrl } from "@/utils/getAddress";
import CopyText from "@/components/DoCopy/CopyText";
import Image from "next/image";
import { Routes, typesOfTransactions } from "./constant";
import isOptionDisable from "@/utils/tookenGraphKey";
import {
  capitalizeWord,
  noExponential,
  simplifyNumber,
  toFixed,
} from "@/utils/commonFunctions";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Collapse, Tooltip } from "antd";
const { Panel } = Collapse;
/*Graph Values */
// export const TRANS_HISTORY_CHART_SECONDS = "1 Day";
export const TRANS_HISTORY_CHART_MINUTES = "7 Days";
export const TRANS_HISTORY_CHART_HOURS = "30 Days";
export const TRANS_HISTORY_CHART_YEAR = "1 Year";
export const TOKEN_PRICE_CHART_HOUR = "12 Hour";
export const ALL_CHARTS_HOUR = "1 Hour";
export const ALL_CHART_ONE_DAY = "1 Day";
export const ALL_CHART_SEVEN_DAY = "7 Days";
export const ALL_CHART_THRITY_DAYS = "30 Days";

let deploymentDate = "2024-03-30";
const activationDate = deploymentDate; // Replace with the actual activation date
const validityPeriodDays = 30;
const sevenDayValidtity = 7;
export let ThirtyDayDisable = false;
export let SevenDayDiasble = false;
export let DefaultValueOfToken = ALL_CHART_SEVEN_DAY;

if (isOptionDisable(activationDate, validityPeriodDays)) {
  ThirtyDayDisable = true;
  if (isOptionDisable(activationDate, sevenDayValidtity)) {
    SevenDayDiasble = true;
    DefaultValueOfToken = ALL_CHART_ONE_DAY;
  } else {
    SevenDayDiasble = false;
    DefaultValueOfToken = ALL_CHART_SEVEN_DAY;
  }
} else {
  ThirtyDayDisable = false;
  DefaultValueOfToken = ALL_CHART_THRITY_DAYS;
}

/* Transaction History Graph */
export const transactionItems = [
  { value: TRANS_HISTORY_CHART_YEAR, label: TRANS_HISTORY_CHART_YEAR },
  { value: TRANS_HISTORY_CHART_HOURS, label: TRANS_HISTORY_CHART_HOURS },
  { value: TRANS_HISTORY_CHART_MINUTES, label: TRANS_HISTORY_CHART_MINUTES },
  // { value: TRANS_HISTORY_CHART_SECONDS, label: TRANS_HISTORY_CHART_SECONDS },
];

/* Other Graph */
export const graphItems = [
  {
    value: TRANS_HISTORY_CHART_YEAR,
    label: TRANS_HISTORY_CHART_YEAR,
  },
  {
    value: ALL_CHART_THRITY_DAYS,
    label: ALL_CHART_THRITY_DAYS,
  },
  {
    value: ALL_CHART_SEVEN_DAY,
    label: ALL_CHART_SEVEN_DAY,
  },
  {
    value: ALL_CHART_ONE_DAY,
    label: ALL_CHART_ONE_DAY,
  },
  {
    value: ALL_CHARTS_HOUR,
    label: ALL_CHARTS_HOUR,
  },
];

/* Token Graph */
export const tokenGraphItems = [
  {
    value: TRANS_HISTORY_CHART_YEAR,
    label: TRANS_HISTORY_CHART_YEAR,
  },
  {
    value: ALL_CHART_THRITY_DAYS,
    label: ALL_CHART_THRITY_DAYS,
    disable: ThirtyDayDisable,
  },
  {
    value: ALL_CHART_SEVEN_DAY,
    label: ALL_CHART_SEVEN_DAY,
    disable: SevenDayDiasble,
  },
  {
    value: ALL_CHART_ONE_DAY,
    label: ALL_CHART_ONE_DAY,
    disable: false,
  },
];

/* Home Page Header */
export const blockchainHeader = [
  {
    key: "1",
    value: "Blocks",
    label: <Link href="/blocks">Blocks</Link>,
  },

  {
    key: "2",
    value: "Transactions",
    label: <Link href="/transactions">Transactions</Link>,
  },

  {
    key: "3",
    value: "Contracts",
    label: <Link href="/contracts">Contracts</Link>,
  },
];

/*Block summary column*/
export const blockColumn = [
  {
    id: "blocknumber",
    title: "Block",
    dataIndex: "blocknumber",
    key: "blocknumber",
    render: (text) => (
      <Link
        className="bghash"
        href={`${Routes.BLOCK_NO}${text}`}
        rel="noopener noreferrer"
      >
        {text}
      </Link>
    ),
  },
  {
    id: "timestamp",
    title: "Timestamp",
    dataIndex: "timestamp",
    key: "timestamp",
    render: (text) => (
      <span className="timestamp">
        {renderTime(text)}
        <span>{convertToDateTime(text)}</span>
      </span>
    ),
  },
  {
    id: "blockhash",
    title: "Block Hash",
    dataIndex: "blockhash",
    key: "blockhash",
    render: (text) => (
      <>
        <div className="iconandlink">
          {getAddress(text)}
          <span>
            <CopyText text={text}></CopyText>
          </span>
        </div>
      </>
    ),
  },
  {
    id: "miner",
    title: "Validator",
    dataIndex: "miner",
    key: "miner",
    render: (text) => (
      <>
        <div className="iconandlink">
          {getAddress(text)}
          <span>
            <CopyText text={text}></CopyText>
          </span>
        </div>
      </>
    ),
  },
  {
    id: "transactionCount",
    title: "txn Count ",
    dataIndex: "transactionCount",
    key: "transactionCount",
  },
];

/*Transaction Summary Column*/

export const transactionSummarycolumn = [
  {
    title: "Txn Hash",
    dataIndex: "txhash",
    key: "txhash",
    render: (text) => (
      <Link
        className="bghash"
        href={`${Routes.Tx_Hash}${text}`}
        rel="noopener noreferrer"
      >
        {getAddress(text)}
      </Link>
    ),
  },
  {
    title: "Block",
    dataIndex: "blocknumber",
    key: "blocknumber",
    render: (text) => (
      <Link
        className=""
        href={`${Routes.BLOCK_NO}${text}`}
        rel="noopener noreferrer"
      >
        {text}
      </Link>
    ),
  },
  {
    title: "Type ",
    key: "type",
    render: (text) => (text?.type ? capitalizeWord(text?.type) : "-"),
  },
  {
    title: "From",
    // dataIndex: "fromAddress",
    key: "fromAddress",
    render: (text) => (
      <>
        {" "}
        {text?.fromAddress && text?.fromAddress !== "N/A" ? (
          <div className="iconandlink">
            <Link
              className="fromicon"
              href={`${Routes.Tx_ADDRESS}${text?.fromAddress}`}
              rel="noopener noreferrer"
            >
              {getAddress(text?.fromAddress)}
            </Link>{" "}
            <span>
              <CopyText text={text?.fromAddress} />
            </span>
          </div>
        ) : (
          "-"
        )}
      </>
    ),
  },
  {
    title: "To",
    // dataIndex: "toAddress",
    key: "toAddress",
    render: (text) => (
      <>
        {text?.toAddress !== "N/A" && text?.toAddress !== "" ? (
          text?.toAddress?.startsWith("0x") ||
          text?.toAddress?.startsWith("Qubetics") ? (
            <div className="iconandlink">
              {text?.type === typesOfTransactions.contractTransfer ||
              text?.type === typesOfTransactions.contractCreation ||
              text?.type === typesOfTransactions.contractExecute ||
              text?.type === typesOfTransactions.contractUpload ? (
                <Link
                  className="fromicon"
                  href={`${Routes.CONTRACT_DETAIL}${text?.toAddress}`}
                  rel="noopener noreferrer"
                >
                  {getAddress(text?.toAddress)}
                </Link>
              ) : (
                <Link
                  className="fromicon"
                  href={`${Routes.Tx_ADDRESS}${text?.toAddress}`}
                  rel="noopener noreferrer"
                >
                  {getAddress(text?.toAddress)}
                </Link>
              )}
              <span>
                <CopyText text={text?.toAddress} />
              </span>
            </div>
          ) : (
            text?.toAddress
          )
        ) : text?.contractAddress !== "N/A" && text?.contractAddress !== "" ? (
          <div className="iconandlink">
            <Link
              className="fromicon"
              href={`${Routes.CONTRACT_DETAIL}${text?.contractAddress}`}
              rel="noopener noreferrer"
            >
              {" "}
              {getAddress(text?.contractAddress)}
            </Link>
            <span>
              <CopyText text={text?.contractAddress} />
            </span>
          </div>
        ) : (
          "-"
        )}
      </>
    ),
  },
  {
    title: "Age ",
    // dataIndex: "timestamp",
    key: "timestamp",
    render: (text) =>
      text?.timestamp ? (
        <span className="timestamp">
          {renderTime(text?.timestamp)}
          <span>{convertToDateTime(text?.timestamp)}</span>
        </span>
      ) : (
        <span className="timestamp">
          {renderTime(text?.createdAt)}
          <span>{convertToDateTime(text?.createdAt)}</span>
        </span>
      ),
  },
  {
    title: "Value",
    key: "value",
    render: (text) =>
      text?.value ? (
        <Tooltip title={noExponential(text?.value)}>
          {noExponential(toFixed(text?.value, 6))}
        </Tooltip>
      ) : (
        0
      ),
  },
  {
    title: "Txn Fee",
    key: "txFee",
    render: (text) =>
      text?.value ? (
        <Tooltip title={noExponential(text?.txFee)}>
          {" "}
          {noExponential(toFixed(text?.txFee, 6))}
        </Tooltip>
      ) : (
        0
      ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) =>
      text === "SUCCESS" ? (
        <span className="successtrans">{capitalizeWord(text)}</span>
      ) : (
        <span className="failedtrans">{capitalizeWord(text)}</span>
      ),
  },
];

//Transaction Details by block number

export const TransactionDetailsColumns = [
  {
    title: "Txn Hash",
    dataIndex: "txhash",
    key: "txhash",
    render: (text) => (
      <Link
        className="bghash"
        href={`${Routes.Tx_Hash}${text}`}
        rel="noopener noreferrer"
      >
        {getAddress(text)}
      </Link>
    ),
  },

  {
    title: "From",
    dataIndex: "fromAddress",
    key: "fromAddress",
    render: (text) => (
      <>
        <div className="iconandlink">
          <Link
            className="fromicon"
            href={`${Routes.Tx_ADDRESS}${text}`}
            rel="noopener noreferrer"
          >
            {getAddress(text)}
          </Link>
          <span>
            {" "}
            <CopyText text={text} />
          </span>
        </div>
      </>
    ),
  },
  {
    title: "To",
    key: "toAddress",
    render: (text) => (
      <>
        {text?.toAddress !== "N/A" && text?.toAddress !== "" ? (
          text?.toAddress?.startsWith("0x") ||
          text?.toAddress?.startsWith("Qubetics") ? (
            <div className="iconandlink">
              {text?.type === typesOfTransactions.contractTransfer ||
              text?.type === typesOfTransactions.contractCreation ||
              text?.type === typesOfTransactions.contractExecute ||
              text?.type === typesOfTransactions.contractUpload ? (
                <Link
                  className="fromicon"
                  href={`${Routes.CONTRACT_DETAIL}${text?.toAddress}`}
                  rel="noopener noreferrer"
                >
                  {getAddress(text?.toAddress)}
                </Link>
              ) : (
                <Link
                  className="fromicon"
                  href={`${Routes.Tx_ADDRESS}${text?.toAddress}`}
                  rel="noopener noreferrer"
                >
                  {getAddress(text?.toAddress)}
                </Link>
              )}
              <span>
                <CopyText text={text?.toAddress} />
              </span>
            </div>
          ) : (
            text?.toAddress
          )
        ) : text?.contractAddress !== "N/A" && text?.contractAddress !== "" ? (
          <div className="iconandlink">
            <Link
              className="fromicon"
              href={`${Routes.CONTRACT_DETAIL}${text?.contractAddress}`}
              rel="noopener noreferrer"
            >
              {" "}
              {getAddress(text?.contractAddress)}
            </Link>
            <span>
              <CopyText text={text?.contractAddress} />
            </span>
          </div>
        ) : (
          "-"
        )}
      </>
    ),
  },

  {
    title: "Value",
    dataIndex: "value",
    key: "value",
    render: (text) => (
      <span>
        <span>{text ? noExponential(toFixed(text, 2)) : "0"}</span>
      </span>
    ),
  },
  {
    title: "Timestamp ",
    // dataIndex: "timestamp",
    key: "timestamp",
    render: (text) =>
      text?.timestamp ? (
        <span className="timestamp">
          {renderTime(text?.timestamp)}
          <span>{convertToDateTime(text?.timestamp)}</span>
        </span>
      ) : text?.createdAt ? (
        <span className="timestamp">
          {renderTime(text?.createdAt)}
          <span>{convertToDateTime(text?.createdAt)}</span>
        </span>
      ) : (
        "-"
      ),
  },
];

/*Address Detail Column*/

export const addressDetailColumn = [
  {
    title:
      "Txn Hash ",
    dataIndex: "txhash",
    key: "txhash",
    render: (text) => (
      <Link
        className="bghash"
        href={`${Routes.Tx_Hash}${text}`}
        rel="noopener noreferrer"
      >
        {getAddress(text)}
      </Link>
    ),
  },
  {
    title: "Block",
    dataIndex: "blocknumber",
    key: "blocknumber",
    render: (text) => (
      <Link
        className="bghash"
        href={`${Routes.BLOCK_NO}${text}`}
        rel="noopener noreferrer"
      >
        {text}
      </Link>
    ),
  },
  {
    title: "Method ",
    key: "type",
    render: (text) => (text?.type ? capitalizeWord(text?.type) : "-"),
  },
  {
    title: "From",
    dataIndex: "fromAddress",
    key: "fromAddress",
    render: (text) => (
      <>
        <div className="iconandlink">
          <Link className="fromicon" href={`${text}`} rel="noopener noreferrer">
            {getAddress(text)}
          </Link>
          <span>
            <CopyText text={text} />
          </span>
        </div>
      </>
    ),
  },
  {
    title: "To",
    key: "toAddress",
    render: (text) => (
      <>
        {text?.toAddress !== "N/A" && text?.toAddress !== "" ? (
          text?.toAddress?.startsWith("0x") ||
          text?.toAddress?.startsWith("Qubetics") ? (
            <div className="iconandlink">
              {text?.type === typesOfTransactions.contractTransfer ||
              text?.type === typesOfTransactions.contractCreation ||
              text?.type === typesOfTransactions.contractExecute ||
              text?.type === typesOfTransactions.contractUpload ? (
                <Link
                  className="fromicon"
                  href={`${Routes.CONTRACT_DETAIL}${text?.toAddress}`}
                  rel="noopener noreferrer"
                >
                  {getAddress(text?.toAddress)}
                </Link>
              ) : (
                <Link
                  className="fromicon"
                  href={`${Routes.Tx_ADDRESS}${text?.toAddress}`}
                  rel="noopener noreferrer"
                >
                  {getAddress(text?.toAddress)}
                </Link>
              )}
              <span>
                <CopyText text={text?.toAddress} />
              </span>
            </div>
          ) : (
            text?.toAddress
          )
        ) : text?.contractAddress !== "N/A" && text?.contractAddress !== "" ? (
          <div className="iconandlink">
            <Link
              className="fromicon"
              href={`${Routes.CONTRACT_DETAIL}${text?.contractAddress}`}
              rel="noopener noreferrer"
            >
              {" "}
              {getAddress(text?.contractAddress)}
            </Link>
            <span>
              <CopyText text={text?.contractAddress} />
            </span>
          </div>
        ) : (
          "-"
        )}
      </>
    ),
  },
  {
    title: "Timestamp ",
    // dataIndex: "timestamp",
    key: "timestamp",
    render: (text) =>
      text?.timestamp ? (
        <span className="timestamp">
          {renderTime(text?.timestamp)}
          <span>{convertToDateTime(text?.timestamp)}</span>
        </span>
      ) : text?.createdAt ? (
        <span className="timestamp">
          {renderTime(text?.createdAt)}
          <span>{convertToDateTime(text?.createdAt)}</span>
        </span>
      ) : (
        "-"
      ),
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) =>
      text === "SUCCESS" ? (
        <span className="successtrans">{capitalizeWord(text)}</span>
      ) : (
        <span className="failedtrans">{capitalizeWord(text)}</span>
      ),
  },
];

/* nodes list views table */
export const nodesColumns = [
  {
    title: "Sr No",
    // dataIndex: "index",
    key: "index",
    render: (text) => text?.index,
  },

  {
    title: "Node Name",
    key: "nodeName",
    render: (text) => (text?.nodeName ? capitalizeWord(text?.nodeName) : "-"),
  },
  {
    title: "Node Address",
    dataIndex: "peerId",
    key: "peerId",
  },

  {
    title: "Location",
    key: "location",
    render: (text) =>
      text?.location?.regionName
        ? capitalizeWord(text?.location?.regionName)
        : "-",
  },
];

/* Contract Column table */
export const contractTableColumn = (currentChain) => [
  {
    id: "name",
    title: "Name",
    key: "name",
    render: (text) => {
      return (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {currentChain !== "Native Chain" && text?.iconUrl && (
            <img
              src={text?.iconUrl}
              alt="icon img"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          <Link href={`/contract/${text?.address}`}>
            {text?.contractName ? capitalizeWord(text?.contractName) : "-"}
          </Link>
        </span>
      );
    },
  },
  {
    id: "type",
    title: "Type",
    key: "type",
    render: (text) => (
      <span className="">{text?.contractType ? text?.contractType : "-"}</span>
    ),
  },
  {
    id: "contractAddress",
    title: "Contract Address",
    key: "contractAddress",
    render: (text) => (
      <span className="iconandlink">
        {text?.address ? (
          <>
            <Link href={`/contract/${text?.address}`}>
              {" "}
              {getAddress(text?.address)}{" "}
            </Link>
            <CopyText text={text?.address} />
          </>
        ) : (
          "-"
        )}
      </span>
    ),
  },
  {
    id: "txHash",
    title: "Txn Hash",
    key: "txHash",
    render: (text) => (
      <span className="iconandlink">
        {text?.txHash ? (
          <>
            {" "}
            <Link href={`${Routes.Tx_Hash}${text?.txHash}`}>
              {getAddress(text?.txHash)}
            </Link>{" "}
            <CopyText text={text?.txHash}></CopyText>
          </>
        ) : (
          "-"
        )}
      </span>
    ),
  },
  {
    id: "lastExecuted",
    title: "Last Executed At ",
    key: "lastExecuted",
    render: (text) => (
      <span className="">
        {text?.updatedAt ? convertToDateTime(text?.updatedAt) : "-"}
      </span>
    ),
  },
  {
    id: "deployedAt",
    title: "Deployed At",
    key: "deployedAt",
    render: (text) => (
      <span className="">
        {text?.createdAt ? convertToDateTime(text?.createdAt) : "-"}
      </span>
    ),
  },
  {
    id: "verified",
    title: "Verified",
    key: "Verified",
    render: (text) => (
      <span className="">
        {text?.verificationType && text?.verificationType > 0 ? (
          <CheckCircleFilled className="green-icon" />
        ) : text?.verificationType && text?.verificationType == -1 ? (
          <CloseCircleFilled className="red-icon" />
        ) : text?.verificationType && text?.verificationType == 0 ? (
          <ClockCircleFilled className="yellow-icon" />
        ) : (
          "-"
        )}
      </span>
    ),
  },
];

/* Contract Transactions & Transfers Column table */
export const contractTransactionsColumn = [
  {
    id: "txHash",
    title: "Txn Hash",
    key: "txHash",
    render: (text) => (
      <div className="iconandlink">
        <Tooltip title={text?.txHash}>
          {text?.txHash ? (
            <Link href={`${Routes.Tx_Hash}${text?.txHash}`}>
              {getAddress(text?.txHash)}
            </Link>
          ) : text?.txhash ? (
            <Link href={`${Routes.Tx_Hash}${text?.txhash}`}>
              {getAddress(text?.txhash)}
            </Link>
          ) : (
            "-"
          )}
        </Tooltip>
        <span>
          <CopyText text={text?.txhash} />
        </span>
      </div>
    ),
  },
  {
    id: "method",
    title: "Method",
    key: "method",
    render: (text) => (
      <span className="">
        {text?.method && text?.method !== "N/A"
          ? capitalizeWord(text?.method)
          : text?.type
          ? capitalizeWord(text?.type)
          : "-"}
      </span>
    ),
  },
  {
    id: "fromAddress",
    title: "From",
    key: "from",
    render: (text) => (
      <div className="iconandlink">
        <Tooltip title={text?.fromAddress}>
          {text?.fromAddress ? (
            <Link href={`/address/${text?.fromAddress}`}>
              {getAddress(text?.fromAddress)}{" "}
            </Link>
          ) : (
            "-"
          )}
        </Tooltip>
        <span>
          <CopyText text={text?.fromAddress} />
        </span>
      </div>
    ),
  },
  {
    id: "toAddress",
    title: "To",
    key: "to",
    render: (text) => (
      <>
        {text?.toAddress !== "N/A" && text?.toAddress !== "" ? (
          text?.toAddress?.startsWith("0x") ||
          text?.toAddress?.startsWith("Qubetics") ? (
            <div className="iconandlink">
              {text?.type === typesOfTransactions.contractTransfer ||
              text?.type === typesOfTransactions.contractCreation ||
              text?.type === typesOfTransactions.contractExecute ||
              text?.type === typesOfTransactions.contractUpload ? (
                <Tooltip title={text?.toAddress}>
                  <Link
                    className="fromicon"
                    href={`${Routes.CONTRACT_DETAIL}${text?.toAddress}`}
                    rel="noopener noreferrer"
                  >
                    {getAddress(text?.toAddress)}
                  </Link>
                </Tooltip>
              ) : (
                <Tooltip title={text?.toAddress}>
                  <Link
                    className="fromicon"
                    href={`${Routes.Tx_ADDRESS}${text?.toAddress}`}
                    rel="noopener noreferrer"
                  >
                    {getAddress(text?.toAddress)}
                  </Link>
                </Tooltip>
              )}
              <span>
                <CopyText text={text?.toAddress} />
              </span>
            </div>
          ) : (
            text?.toAddress
          )
        ) : text?.contractAddress !== "N/A" && text?.contractAddress !== "" ? (
          <div className="iconandlink">
            <Tooltip title={text?.contractAddress}>
              <Link
                className="fromicon"
                href={`${Routes.CONTRACT_DETAIL}${text?.contractAddress}`}
                rel="noopener noreferrer"
              >
                {" "}
                {getAddress(text?.contractAddress)}
              </Link>
            </Tooltip>
            <span>
              <CopyText text={text?.contractAddress} />
            </span>
          </div>
        ) : (
          "-"
        )}
      </>
    ),
  },
  {
    id: "height",
    title: "Blocks",
    key: "height",
    render: (text) => (
      <span className="">
        {text?.blockNumber ? (
          <Link href={`${Routes.BLOCK_NO}${text?.blockNumber}`}>
            {text?.blockNumber}
          </Link>
        ) : text?.blocknumber ? (
          <Link href={`${Routes.BLOCK_NO}${text?.blocknumber}`}>
            {text?.blocknumber}
          </Link>
        ) : (
          "-"
        )}
      </span>
    ),
  },
  {
    id: "fee",
    title: "Amount",
    key: "fee",
    render: (text) => (
      <span className="">
        {text?.gasFee
          ? noExponential(text?.gasFee)
          : text?.txFee
          ? noExponential(Number(text?.txFee) / 10 ** 18)
          : "0"}
      </span>
    ),
  },
  {
    id: "age",
    title: "Timestamp",
    key: "age",
    render: (text) => (
      <span className="">
        {text?.timestamp ? renderTime(text?.timestamp) : "-"}
      </span>
    ),
  },
  {
    id: "status",
    title: "Status",
    key: "status",
    render: (text) => (
      <span className="">
        {text?.status ? (
          text?.status.toLowerCase() === "success" ? (
            <span className="successtrans">Success</span>
          ) : (
            <span className="failedtrans">Failed</span>
          )
        ) : (
          "-"
        )}
      </span>
    ),
  },
];

/*Contract Holders Column------------ */

export const HolderColumn = [
  {
    id: "rank",
    title: "Rank",
    key: "rank",
    render: (text) => <span className="">{text?.rank ? text?.rank : "-"}</span>,
  },
  {
    id: "address",
    title: "Address",
    key: "address",
    render: (text) => (
      <div className="iconandlink">
        {text?.address ? (
          <Tooltip title={text?.address}>
            <Link href={`${Routes.Tx_ADDRESS}${text?.address}`}>
              {getAddress(text?.address)}{" "}
            </Link>
          </Tooltip>
        ) : (
          "-"
        )}
        <span>
          <CopyText text={text?.address} />
        </span>
      </div>
    ),
  },
  {
    id: "quantity",
    title: "Quantity",
    key: "quantity",
    render: (text) => (
      <span className="">
        {text?.tokenBalance ? noExponential(text?.tokenBalance) : "-"}
      </span>
    ),
  },
  {
    id: "percentage",
    title: "Percentage",
    key: "percentage",
    render: (text) => (
      <span className="">
        {Number(text?.tokenBalance) && Number(text?.totalSupply)
          ? noExponential(
              (Number(text?.tokenBalance) * 100) / Number(text?.totalSupply)
            ) + " %"
          : "0%"}
      </span>
    ),
  },
];

/*Contract Events Column-------------- */

export const EventsColumn = [
  {
    id: "txHash",
    title: "Txn Hash",
    key: "txHash",
    render: (text) => (
      <div className="iconandlink">
        {text?.txHash ? (
          <Link href={`${Routes.Tx_Hash}${text?.txHash}`}>
            {getAddress(text?.txHash)}
          </Link>
        ) : (
          "-"
        )}
        <span>
          <CopyText text={text?.contractAddress} />
        </span>
      </div>
    ),
  },
  {
    id: "block",
    title: "Block",
    key: "block",
    render: (text) => (
      <span className="">
        {text?.blockNumber ? (
          <Link href={`${Routes.BLOCK_NO}${text?.blockNumber}`}>
            {text?.blockNumber}
          </Link>
        ) : (
          "-"
        )}
      </span>
    ),
  },
  {
    id: "age",
    title: "Timestamp",
    key: "age",
    render: (text) => (
      <span className="">
        {text?.timestamp ? renderTime(text?.timestamp) : "-"}
      </span>
    ),
  },
  {
    id: "method",
    title: "Method",
    key: "method",
    render: (text) => (
      <span className="">
        {text?.methodSignature && text?.methodSignature !== "N/A"
          ? text?.methodSignature
          : "-"}
      </span>
    ),
  },
  // {
  //   id: "logs",
  //   title: "Logs",
  //   // dataIndex: "Logs",
  //   key: "logs",
  //   render: (text) => (
  //     <span className="">
  //       {text?.method && text?.method !== "N/A" && text?.topics ? (
  //         <span>
  //           {capitalizeWord(text?.method)}
  //           <br />
  //           {text?.topics?.map((item, index) => (
  //             <p key={index}>
  //               {`[topic${index}]`} {item}
  //             </p>
  //           ))}
  //         </span>
  //       ) : (
  //         "-"
  //       )}
  //     </span>
  //   ),
  // },

  {
    id: "logs",
    title: "Logs",
    key: "logs",
    render: (text) => {
      const decodedData = text?.decodedlogs;
      let decodedLogs;
      if (decodedData) {
        decodedLogs = JSON.parse(decodedData);
      }

      return (
        <p className="logEvent">
          {decodedLogs != undefined && decodedLogs[0] && (
            <Collapse accordion>
              <Panel
                header={
                  text?.method
                    ? capitalizeWord(text?.method)
                    : decodedLogs[0]?.name
                }
                key="1"
              >
                <p>
                  {decodedLogs[0]?.events?.map((res) => {
                    return (
                      <>
                        <p>
                          <span className="lightGray">{res?.type} </span>
                          {res?.name}
                        </p>
                        {res?.type.includes("uint") &&
                        res?.value?.includes("0x") ? (
                          <span>{Number(res?.value)}</span>
                        ) : res?.value?.includes("0x") ? (
                          <Link href={`/address/${res?.value}`}>
                            {res?.value}
                          </Link>
                        ) : (
                          res?.value
                        )}
                      </>
                    );
                  })}
                </p>
              </Panel>
            </Collapse>
          )}
          <span className="">
            {(text?.method && text?.method !== "N/A" && text?.topics) ||
            (decodedLogs && text?.topics) ? (
              <>
                {decodedLogs != undefined ? "" : capitalizeWord(text?.method)}
                {/* {capitalizeWord(text?.method)} */}
                {/* <br /> */}
                {text?.topics?.map((item, index) => (
                  <p key={index}>
                    {`[topic${index}]`} {item}
                  </p>
                ))}
              </>
            ) : (
              "-"
            )}
          </span>
          {decodedData?.length > 1 && (
            <Link href={`/tx/${text?.txHash}`}>.....more</Link>
          )}
        </p>
        // <>
        //   {decodedLogs.map((e, i) => {
        //     console.log("E : : ", e);
        //     return (
        //       <p className="logEvent" key={i + "logevent"}>
        //         {e != undefined && e && (
        //           <Collapse accordion>
        //             <Panel
        //               header={e?.name ? capitalizeWord(e?.name) : e?.name}
        //               key="1"
        //             >
        //               <p>
        //                 {e?.events?.map((res, i) => {
        //                   return (
        //                     <span key={i + "data1"}>
        //                       <p>
        //                         <span className="lightGray">{res?.type} </span>
        //                         {res?.name}
        //                       </p>
        //                       {res?.type.includes("uint") &&
        //                       res?.value?.includes("0x") ? (
        //                         <span>{Number(res?.value)}</span>
        //                       ) : res?.value?.includes("0x") ? (
        //                         <Link href={`/address/${res?.value}`}>
        //                           {res?.value}
        //                         </Link>
        //                       ) : (
        //                         res?.value
        //                       )}
        //                     </span>
        //                   );
        //                 })}
        //               </p>
        //             </Panel>
        //           </Collapse>
        //         )}
        //         <span className="">
        //           {(text?.method && text?.method !== "N/A" && text?.topics) ||
        //           (e && text?.topics) ? (
        //             <>
        //               {e != undefined ? "" : capitalizeWord(text?.method)}
        //               {/* {capitalizeWord(text?.method)} */}
        //               {/* <br /> */}
        //               {text?.topics?.map((item, index) => (
        //                 <p key={index}>
        //                   {`[topic${index}]`} {item}
        //                 </p>
        //               ))}
        //             </>
        //           ) : (
        //             "-"
        //           )}
        //         </span>
        //       </p>
        //     );
        //   })}
        // </>
      );
    },
  },
];

/* Top Token Listing Column---------- */

export const TokenColumn = [
  {
    id: "name",
    title: "Name",
    key: "tokenName",
    render: (text) => (
      <span className="assetnamedetail">
        {text?.tokenName ? capitalizeWord(text?.tokenName) : "-"}
      </span>
    ),
  },
  {
    id: "contractAddress",
    title: "Contract Address",
    key: "contractAddress",
    render: (text) => (
      <div>
        {text?.contractAddress ? (
          <>
            <Link href={`/contract/${text?.contractAddress}`}>
              {" "}
              {getAddress(text?.contractAddress)}{" "}
            </Link>
            <CopyText text={text?.contractAddress} />
          </>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    id: "totalSupply",
    title: "Total supply",
    key: "totalSupply",
    render: (text) => (
      <span>
        {text?.totalSupply
          ? text?.native == true
            ? noExponential(toFixed(Number(text?.totalSupply)))
            : noExponential(
                toFixed(
                  Number(text?.totalSupply) / 10 ** Number(text?.decimal),
                  4
                )
              )
          : "-"}
      </span>
    ),
  },
];

/*Token Transfers*/

export const TokenTransfers = [
  {
    id: "txhash",
    title: "Transaction Hash",
    key: "txhash",
    render: (text) => (
      <div>
        {text?.txhash ? (
          <>
            <Link href={`/tx/${text?.txhash}`}>
              {" "}
              {getAddress(text?.txhash)}{" "}
            </Link>
            <CopyText text={text?.txhash} hoverText={"hash"} />
          </>
        ) : (
          "-"
        )}
      </div>
    ),
  },

  {
    id: "blocks",
    title: "Blocks",
    key: "blocknumber",
    render: (text) => <span className="">{text?.blocknumber ?? "-"}</span>,
  },

  {
    id: "input",
    title: "Method",
    key: "input",
    render: (text) => (
      <span className="">
        {text?.input ? JSON.parse(text.input)?.name ?? "-" : "-"}
      </span>
    ),
  },

  {
    id: "fromAddress",
    title: "From",
    key: "fromAddress",
    render: (text) => (
      <div>
        {text?.fromAddress ? (
          <>
            <Link href={`/address/${text?.fromAddress}`}>
              {" "}
              {getAddress(text?.fromAddress)}{" "}
            </Link>
            <CopyText text={text?.fromAddress} />
          </>
        ) : (
          "-"
        )}
      </div>
    ),
  },

  {
    id: "input",
    title: "To",
    key: "input",
    render: (text) => {
      let address = null;

      if (text?.input) {
        const parsedData = JSON.parse(text?.input);
        if (
          parsedData?.name === "transfer" ||
          parsedData?.name === "transferFrom"
        ) {
          const filteredData = parsedData?.params.filter(
            (e) =>
              (e?.name === "to" || e?.name === "recipient") &&
              e?.type === "address"
          );
          address = filteredData[0]?.value ?? null;
        }
      }

      return (
        <span>
          {address ? (
            <>
              <Link href={`/address/${address}`}> {getAddress(address)} </Link>
              <CopyText text={address} />
            </>
          ) : (
            "-"
          )}
        </span>
      );
    },
  },

  {
    id: "amount",
    title: "Amount",
    key: "input",
    render: (text) => {
      let amount = null;

      if (text?.input) {
        const parsedData = JSON.parse(text?.input);
        if (parsedData) {
          const amtArr = parsedData?.params.filter(
            (e) =>
              (e.name === "amount" || e.name === "value") &&
              e.type.includes("uint")
          );
          amount = amtArr[0]?.value;
        }
      }

      return <span>{amount ?? "-"}</span>;
    },
  },
  {
    id: "tokenName",
    title: "Tokens",
    key: "tokenName",
    render: (text) => <span className="">{text?.tokenName ?? "-"}</span>,
  },

  {
    id: "age",
    title: "Age",
    key: "timestamp",
    render: (text) => (
      <span className="">
        {text?.timestamp ? renderTime(text?.timestamp) : "-"}
      </span>
    ),
  },
];

/* Token Transfer Column */
export const TokenTransferColumn = [
  {
    id: "hash",
    title: "Transaction Hash",
    key: "txHash",
    render: (text) => (
      <span className="assetnamedetail">
        {text?.txhash ? (
          <Link
            className="bghash"
            href={`${Routes.Tx_Hash}${text?.txhash}`}
            rel="noopener noreferrer"
          >
            {getAddress(text?.txhash)}
          </Link>
        ) : (
          "-"
        )}
      </span>
    ),
  },
  {
    id: "method",
    title: "Method",
    key: "method",
    render: (text) => (
      <div>
        {text?.input
          ? capitalizeWord(JSON.parse(text?.input)?.name)
          : text?.logs?.length > 0
          ? JSON.parse(text?.logs)[0]?.name
          : "-"}
      </div>
    ),
  },
  {
    id: "block",
    title: "Block",
    key: "block",
    render: (text) => (
      <span>{text?.blocknumber ? text?.blocknumber : "-"}</span>
    ),
  },
  {
    id: "age",
    title: "Age",
    key: "age",
    render: (text) => (
      <span className="">
        {text?.createdAt ? renderTime(text?.createdAt) : "-"}
      </span>
    ),
  },
  {
    id: "from",
    title: "From",
    key: "from",
    render: (text) => (
      <span>
        {text?.fromAddress ? (
          <div className="iconandlink">
            <Link
              className="fromicon"
              href={`${Routes.Tx_ADDRESS}${text?.fromAddress}`}
              rel="noopener noreferrer"
            >
              {getAddress(text?.fromAddress)}
            </Link>
            <span>
              {" "}
              <CopyText text={text?.fromAddress} />
            </span>
          </div>
        ) : (
          "-"
        )}
      </span>
    ),
  },
  {
    id: "to",
    title: "To",
    key: "to",
    render: (text) => (
      <span>
        {text?.toAddress ? (
          <div className="iconandlink">
            <Link
              className="fromicon"
              href={`${Routes.Tx_ADDRESS}${text?.toAddress}`}
              rel="noopener noreferrer"
            >
              {getAddress(text?.toAddress)}
            </Link>

            <span>
              <CopyText text={text?.toAddress} />
            </span>
          </div>
        ) : (
          "-"
        )}
      </span>
    ),
  },
  {
    id: "value",
    title: "Value",
    key: "value",
    render: (text) => (
      <span>
        {text?.input && JSON.parse(text?.input)?.params[1]?.value
          ? JSON.parse(text?.input)?.params[1]?.value
          : "0"}
      </span>
    ),
  },
  {
    id: "tokens",
    title: "Tokens",
    key: "tokens",
    render: (text) => (
      <span>
        {text?.tokenName
          ? text?.tokenName + " (" + text?.tokenSymbol + " )"
          : "-"}
      </span>
    ),
  },
];

/* Validators Table Column----------- */

export const validatorsColumn = [
  {
    title: "Validator Name",
    key: "name",
    render: (text) => (
      <span className="">{text?.name ? capitalizeWord(text?.name) : "-"}</span>
    ),
  },
  {
    title: "Voting Power",
    key: "votingPower",
    render: (text) => (
      <span className="">
        {text?.votingPower ? noExponential(text?.votingPower) : "-"}
      </span>
    ),
  },
  {
    title: "Delegators",
    key: "delegators",
    render: (text) => (
      <span className="">
        {text?.delegatorCount ? text?.delegatorCount : "-"}
      </span>
    ),
  },
  {
    title: "Self Bonded",
    key: "selfStake",
    render: (text) => (
      <span className="">
        {text?.selfStake
          ? noExponential(Number(text?.selfStake) / 10 ** 18)
          : "-"}
      </span>
    ),
  },
  {
    title: "Commission",
    key: "commission",
    render: (text) => (
      <span className="">
        {text?.commission
          ? noExponential(Number(text?.commission).toFixed(4)) + " %"
          : "-"}
      </span>
    ),
  },
  {
    title: "Status",
    key: "status",
    render: (text) => (
      <span className="">
        {text?.status ? (
          text?.status == "active" ? (
            <span className="successtrans">Active</span>
          ) : text?.status == "inactive" ? (
            <span className="failedtrans"> InActive </span>
          ) : (
            <span className="pendingtrans"> Deactivating </span>
          )
        ) : (
          "-"
        )}
      </span>
    ),
  },
];

/*Token By Address Column */
export const tokensByAddressColumn = [
  {
    title: "Token Name",
    key: "name",
    render: (text) => (
      <span className="">
        {text?.tokenName ? capitalizeWord(text?.tokenName) : "-"}
      </span>
    ),
  },
  {
    title: "Symbol",
    key: "symbol",
    render: (text) => (
      <span className="">{text?.tokenSymbol ? text?.tokenSymbol : "-"}</span>
    ),
  },
  {
    id: "contractAddress",
    title: "Contract Address",
    key: "contractAddress",
    render: (text) => (
      <div>
        {text?.contractAddress ? (
          <>
            <Link href={`/contract/${text?.contractAddress}`}>
              {" "}
              {getAddress(text?.contractAddress)}{" "}
            </Link>
            <CopyText text={text?.contractAddress} />
          </>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    title: "Value",
    key: "value",
    render: (text) => (
      <span className="">
        {text?.tokenBalance ? noExponential(Number(text?.tokenBalance)) : "-"}
      </span>
    ),
  },
];
