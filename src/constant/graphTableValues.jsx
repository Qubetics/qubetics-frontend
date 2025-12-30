"use-client";
import { EventLogsDex } from "@/components/contracts/EventLogsDex";
import CopyText from "@/components/DoCopy/CopyText";
import {
  capitalizeFirstLetter,
  capitalizeWord,
  formateTotalSupply,
  formatToTwoDecimals,
  formatMillionNumber,
  formatToTwoDecimals,
  noExponential,
  toFixed,
} from "@/utils/commonFunctions";
import getAddress from "@/utils/getAddress";
import { convertToDateTime, renderTime } from "@/utils/renderTime";
import isOptionDisable from "@/utils/tookenGraphKey";
import { Collapse, Tooltip } from "antd";
import Link from "next/link";
import { Tokenicons } from "../../public/SvgIcons";
import {
  currencyName,
  formatValue,
  Routes,
  typesOfTransactions,
} from "./constant";
const { Panel } = Collapse;
/*Graph Values */
export const TRANS_HISTORY_CHART_SECONDS = "1 Day";
export const TRANS_HISTORY_CHART_MINUTES = "7 Days";
export const TRANS_HISTORY_CHART_HOURS = "30 Days";
export const TRANS_HISTORY_CHART_YEAR = "1 Year";
export const TOKEN_PRICE_CHART_HOUR = "12 Hour";
export const ALL_CHARTS_HOUR = "1 Hour";
export const ALL_CHART_ONE_DAY = "1 Day";
export const ALL_CHART_SEVEN_DAY = "7 Days";
export const ALL_CHART_THRITY_DAYS = "30 Days";
export const TRANS_HISTORY_CHART_365_DAYS = "365 Days";
export const TRANS_HISTORY_CHART_7_DAYS = "7 Days";
export const TRANS_HISTORY_CHART_30_DAYS = "30 Days";

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
  { value: TRANS_HISTORY_CHART_MINUTES, label: TRANS_HISTORY_CHART_MINUTES },
  { value: TRANS_HISTORY_CHART_HOURS, label: TRANS_HISTORY_CHART_HOURS },
  { value: TRANS_HISTORY_CHART_YEAR, label: TRANS_HISTORY_CHART_YEAR },
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
        <div className="iconandlink blockLinkItems">
          <Link href={`${Routes.BLOCK_NO}${text}`}>{getAddress(text)}</Link>
          <span>
            <CopyText hoverText={"hash"} text={text}></CopyText>
          </span>
        </div>
      </>
    ),
  },
  {
    id: "transactionCount",
    title: "Txn Count ",
    dataIndex: "transactionCount",
    key: "transactionCount",
  },
  {
    id: "miner",
    title: "Validator",
    dataIndex: "miner",
    key: "miner",
    render: (text) => (
      <div className="iconandlink blockLinks">
        {getAddress(text)}
        {/* <span>
            <CopyText text={text}></CopyText>
          </span> */}
      </div>
    ),
  },
];

/*Transaction Summary Column*/

export const transactionSummarycolumn = [
  {
    title: "Txn Hash",
    dataIndex: "txhash",
    key: "txhash",
    render: (text) => (
      <div className="txnHashcopy addressText">
        <Link
          className="bghash"
          href={`${Routes.Tx_Hash()}${text}`}
          rel="noopener noreferrer"
        >
          {getAddress(text)}
        </Link>
        <span className="spancopy">
          <CopyText text={text} />
        </span>
      </div>
    ),
  },
  {
    title: "Type ",
    key: "type",
    render: (text) => (text?.type ? capitalizeWord(text?.type) : "-"),
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
    title: "From",
    // dataIndex: "fromAddress",
    key: "fromAddress",
    render: (text) => (
      <>
        {" "}
        {text?.fromAddress && text?.fromAddress !== "N/A" ? (
          <div className="iconandlink blockLinkItems">
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
        {text?.toAddress !== "N/A" &&
        text?.toAddress !== "" &&
        text?.toAddress !== null ? (
          text?.toAddress?.startsWith("0x") ||
          text?.toAddress?.startsWith("Qubetics") ? (
            <div className="iconandlink">
              {text?.type === typesOfTransactions.contractTransfer ||
              text?.type === typesOfTransactions.contractCreation ||
              text?.type === typesOfTransactions.contractExecute ||
              text?.type === typesOfTransactions.contractUpload ? (
                <Link
                  className="fromicon blockLink"
                  href={`${Routes.CONTRACT_DETAIL}${text?.toAddress}`}
                  rel="noopener noreferrer"
                >
                  {getAddress(text?.toAddress)}
                </Link>
              ) : (
                <Link
                  className="fromicon blockLink"
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
            <div className="iconandlink">
              <Link
                href={`${Routes.Tx_ADDRESS}${text?.toAddress}`}
                className="blockLink"
              >
                {getAddress(text?.toAddress)}
              </Link>
              <span>
                <CopyText text={text?.toAddress} />
              </span>
            </div>
          )
        ) : text?.contractAddress !== "N/A" && text?.contractAddress !== "" ? (
          <div className="iconandlink">
            <Link
              className="fromicon blockLink"
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
      ) : (
        <span className="timestamp">
          {renderTime(text?.createdAt)}
          <span>{convertToDateTime(text?.createdAt)}</span>
        </span>
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
    title: `Value(${currencyName})`,
    key: "value",
    render: (text) => {
      const value = text?.value || 0;
      return (
        <Tooltip title={`${value} ${currencyName}`}>
          <span>{`${formatToTwoDecimals(value)} ${currencyName}`}</span>
        </Tooltip>
      );
    },
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
      <div className="iconandlink">
        <Link
          className="fromicon"
          href={`${Routes.Tx_Hash()}${text}`}
          rel="noopener noreferrer"
        >
          {getAddress(text)}
        </Link>
        <span>
          <CopyText text={text} />
        </span>
      </div>
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
    render: (text) => {
      const toAddress = text?.toAddress;
      const contractAddress = text?.contractAddress;
      const isValidAddress = toAddress && toAddress !== "N/A";
      const isContractType = [
        typesOfTransactions.contractTransfer,
        typesOfTransactions.contractCreation,
        typesOfTransactions.contractExecute,
        typesOfTransactions.contractUpload,
      ].includes(text?.type);
      const isSpecialPrefix =
        toAddress?.startsWith("0x") || toAddress?.startsWith("Qubetics");

      if (isValidAddress && isSpecialPrefix) {
        const link = isContractType
          ? `${Routes.CONTRACT_DETAIL}${toAddress}`
          : `${Routes.Tx_ADDRESS}${toAddress}`;

        return (
          <div className="iconandlink">
            <Link className="fromicon" href={link} rel="noopener noreferrer">
              {getAddress(toAddress)}
            </Link>
            <span>
              <CopyText text={toAddress} />
            </span>
          </div>
        );
      }

      if (isValidAddress) {
        return (
          <div className="iconandlink">
            <Link
              href={`${Routes.Tx_ADDRESS}${toAddress}`}
              rel="noopener noreferrer"
            >
              {getAddress(toAddress)}
            </Link>
            <span>
              <CopyText text={toAddress} />
            </span>
          </div>
        );
      }

      if (contractAddress && contractAddress !== "N/A") {
        return (
          <div className="iconandlink">
            <Link
              className="fromicon"
              href={`${Routes.CONTRACT_DETAIL}${contractAddress}`}
              rel="noopener noreferrer"
            >
              {getAddress(contractAddress)}
            </Link>
            <span>
              <CopyText text={contractAddress} />
            </span>
          </div>
        );
      }

      return "-";
    },
  },

  {
    title: `Value (${currencyName})`,
    dataIndex: "value",
    key: "value",
    render: (text) => (
      <span>
        <Tooltip title={`${noExponential(toFixed(text, 2))}  ${currencyName}`}>
          {text ? noExponential(toFixed(text, 2)) : "0"}
        </Tooltip>
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

export const addressDetailColumn = (address) => [
  {
    title: "Txn Hash ",
    dataIndex: "txhash",
    key: "txhash",
    render: (text) => (
      <div className="iconandlink addressText">
        <Link
          className="fromicon"
          href={`${Routes.Tx_Hash()}${text}`}
          rel="noopener noreferrer"
        >
          {getAddress(text)}
        </Link>
        <span>
          <CopyText text={text} />
        </span>
      </div>
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
    title: "Type ",
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
            <div className="iconandlink">
              <Link href={`${Routes.Tx_ADDRESS}${text?.toAddress}`}>
                {getAddress(text?.toAddress)}
              </Link>
              <span>
                <CopyText text={text?.toAddress} />
              </span>
            </div>
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
    title: "Type ",
    key: "type",
    render: (text) => {
      return (
        <span
          className={`transferStatus-box ${
            text?.toAddress.toLowerCase() === address.toLowerCase()
              ? "green"
              : "red"
          }`}
        >
          {text?.toAddress.toLowerCase() === address.toLowerCase()
            ? "IN"
            : "OUT"}
        </span>
      );
    },
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
    render: (text) => (
      <Tooltip title={`${text || 0} TICS`}>
        <span>{`${formatToTwoDecimals(text || 0)} TICS`}</span>
      </Tooltip>
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
/* nodes list views table */
export const nodesColumns = (totalNodeAddress) => [
  {
    title: "Node Name",
    key: "nodeName",
    render: (text) => (text?.nodeName ? capitalizeWord(text?.nodeName) : "-"),
  },
  {
    title: `Node Address (${totalNodeAddress})`,
    // dataIndex: "peerId",
    key: "peerId",
    render: (text) => {
      return (
        <span
          style={{ display: "flex", alignItems: "center" }}
          className="iconandlink"
        >
          {text.peerId ? text?.peerId : "-"}
          {/* <CopyText text={text?.peerId} /> */}
        </span>
      );
    },
  },

  {
    title: "Location",
    key: "location",
    render: (text) =>
      text?.location?.country ? capitalizeWord(text?.location?.country) : "-",
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
          {/* {currentChain !== "Native Chain" && text?.iconUrl && (
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
          )} */}
          <Link href={`/contract/${text?.address}`}>
            {capitalizeWord(
              text?.contractname || text?.contractName || text?.tokenName || "-"
            )}
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
            <Link href={`/contract/${text?.address}`} className="contAdd">
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
            <Link
              href={`${Routes.Tx_Hash()}${text?.txHash}`}
              className="contAdd"
            >
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
    id: "status",
    title: "Status",
    key: "status",
    render: (text) => (
      <span className="">
        {text?.verificationType && text?.verificationType > 0 ? (
          // <CheckCircleFilled className="green-icon" />
          <p className="green-icon">Verified</p>
        ) : text?.verificationType && text?.verificationType == -1 ? (
          // <CloseCircleFilled className="red-icon" />
          <p className="red-icon">Unverified</p>
        ) : (text?.verificationType && text?.verificationType == 0) ||
          text?.verificationType === null ? (
          <p className="yellow-icon">Pending</p>
        ) : (
          // <ClockCircleFilled className="yellow-icon" />
          <p className="yellow-icon">Pending</p>
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
            <Link href={`${Routes.Tx_Hash()}${text?.txHash}`}>
              {getAddress(text?.txHash)}
            </Link>
          ) : text?.txhash ? (
            <Link href={`${Routes.Tx_Hash()}${text?.txhash}`}>
              {getAddress(text?.txhash)}
            </Link>
          ) : (
            "-"
          )}
        </Tooltip>
        <span>
          <CopyText text={text?.txHash ? text?.txHash : text?.txhash} />
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
  {
    id: "fee",
    title: `Fee( ${currencyName})`,
    key: "fee",
    render: (text) => (
      <span className="">
        <Tooltip
          title={
            text?.txFee
              ? Number(noExponential(Number(text?.txFee))).toFixed(18)
              : "0"
          }
        >
          {text?.txFee
            ? Number(noExponential(Number(text?.txFee))).toFixed(6)
            : "0"}
        </Tooltip>
      </span>
    ),
  },
  {
    id: "amount",
    title: "Amount (TICS)",
    key: "amount",
    render: (text) => {
      const decimal = text?.decimal ? text?.decimal : 18;
      return (
        <Tooltip
          title={
            text?.value
              ? text?.value
              : // ? noExponential(Number(text?.value) / 10 ** Number(decimal))
                "0"
          }
        >
          {text?.value
            ? text?.value
            : // ? noExponential(Number(text?.value) / 10 ** Number(decimal))
              "0"}
        </Tooltip>
      );
    },
  },
  {
    id: "height",
    title: "Block",
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
    id: "age",
    title: "Timestamp",
    key: "age",
    render: (text) =>
      text?.timestamp ? (
        <span className="timestamp">
          {renderTime(text?.timestamp)}
          <span>{convertToDateTime(text?.timestamp)}</span>
        </span>
      ) : (
        "-"
      ),
  },
];
export const internalTxns = [
  {
    id: "txHash",
    title: "Txn Hash",
    key: "txnHash",
    render: (text) => (
      <div className="iconandlink">
        <Tooltip title={text?.txnHash}>
          {text?.txnHash ? (
            <Link href={`${Routes.Tx_Hash()}${text?.txHash}`}>
              {getAddress(text?.txnHash)}
            </Link>
          ) : text?.txnHash ? (
            <Link href={`${Routes.Tx_Hash()}${text?.txnHash}`}>
              {getAddress(text?.txnHash)}
            </Link>
          ) : (
            "-"
          )}
        </Tooltip>
        <span>
          <CopyText text={text?.txnHash ? text?.txnHash : text?.txnHash} />
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
          ? capitalizeWord("transfer")
          : "Transfer"
          ? capitalizeWord("Transfer")
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
  // {
  //   id: "status",
  //   title: "Status",
  //   key: "status",
  //   render: (text) => (
  //     <span className="">
  //       {text?.status ? (
  //         text?.status.toLowerCase() === "success" ? (
  //           <span className="successtrans">Success</span>
  //         ) : (
  //           <span className="failedtrans">Failed</span>
  //         )
  //       ) : (
  //         "-"
  //       )}
  //     </span>
  //   ),
  // },
  // {
  //   id: "fee",
  //   title: "Fee(TICS)",
  //   key: "fee",
  //   render: (text) => (
  //     <span className="">
  //       <Tooltip
  //         title={
  //           text?.txFee
  //             ? Number(noExponential(Number(text?.txFee))).toFixed(18)
  //             : "0"
  //         }
  //       >
  //         {text?.txFee
  //           ? Number(noExponential(Number(text?.txFee))).toFixed(6)
  //           : "0"}
  //       </Tooltip>
  //     </span>
  //   ),
  // },
  {
    id: "amount",
    title: "Amount (TICS)",
    key: "value",
    render: (text) => (
      <span className="">
        <Tooltip
          title={
            text?.value
              ? formatMillionNumber(
                  Number(noExponential(Number(text?.value) / 10 ** Number(18)))
                )
              : "0"
          }
        >
          {text?.value
            ? formatMillionNumber(
                noExponential(Number(text?.value) / 10 ** Number(18))
              )
            : "0"}
        </Tooltip>
      </span>
    ),
  },
  {
    id: "height",
    title: "Block",
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
    id: "age",
    title: "Timestamp",
    key: "age",
    render: (text) =>
      text?.timestamp ? (
        <span className="timestamp">
          {renderTime(text?.timestamp)}
          <span>{convertToDateTime(text?.timestamp)}</span>
        </span>
      ) : (
        "-"
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
    id: "token",
    title: "Token Name",
    key: "token",
    render: (text) => (
      <span className="">{text?.tokenName ? text?.tokenName : "-"}</span>
    ),
  },
  {
    id: "type",
    title: "Type",
    key: "type",
    render: (text) => <span className="">{text?.type ? text?.type : "-"}</span>,
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
              {getAddress(text?.address)}
            </Link>
          </Tooltip>
        ) : (
          "-"
        )}
        <CopyText text={text?.address} />
      </div>
    ),
  },
  {
    id: "quantity",
    title: "Quantity",
    key: "quantity",
    render: (text) => (
      <Tooltip title={text?.tokenBalance}>
        {text?.tokenBalance ? noExponential(text?.tokenBalance) : "-"}
      </Tooltip>
    ),
  },
  {
    id: "percentage",
    title: "Percentage(%)",
    key: "percentage",
    render: (text) => (
      <Tooltip
        title={(Number(text?.tokenBalance) * 100) / Number(text?.totalSupply)}
      >
        {Number(text?.tokenBalance) && Number(text?.totalSupply)
          ? noExponential(
              (Number(text?.tokenBalance) * 100) / Number(text?.totalSupply)
            ) + " %"
          : "0%"}
      </Tooltip>
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
      <div className="iconandlink" style={{ verticalAlign: "top" }}>
        {text?.txHash ? (
          <Link href={`${Routes.Tx_Hash()}${text?.txHash}`}>
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
    render: (text) =>
      text?.timestamp ? (
        <span className="timestamp">
          {renderTime(text?.timestamp)}
          <span>{convertToDateTime(text?.timestamp)}</span>
        </span>
      ) : (
        "-"
      ),
  },
  {
    id: "method",
    title: "Method",
    key: "method",
    render: (text) => (
      <span className="">
        {text?.method && text?.method !== "N/A" ? text?.method : "-"}
      </span>
    ),
  },
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
                          <span className="">{res?.type} </span>
                          {res?.name}
                        </p>
                        {res?.type?.includes("uint") &&
                        res?.value?.includes("0x") ? (
                          <span>{Number(res?.value)}</span>
                        ) : !res?.value && res?.value?.includes("0x") ? (
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
          <EventLogsDex decodedLogs={decodedLogs} text={text} />
        </p>
      );
    },
  },
];

/* Top Token Listing Column---------- */

export const TokenColumn = [
  {
    id: "name",
    title: "Token Name",
    key: "tokenName",
    render: (text) => (
      <span className="assetnamedetail">
        {text?.iconUrl && text?.iconUrl !== "" ? (
          <img
            src={text.iconUrl}
            alt="icon img"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div>
            <Tokenicons />
          </div>
        )}
        <Link href={`/contract/${text?.contractAddress}`}>
          {text?.tokenName ? capitalizeWord(text?.tokenName) : "-"}
        </Link>
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
          <div className="flexedItemsCenter">
            <Link
              href={`/contract/${text?.contractAddress}`}
              className="contAdd"
            >
              {" "}
              {getAddress(text?.contractAddress)}{" "}
            </Link>
            <CopyText text={text?.contractAddress} />
          </div>
        ) : (
          "-"
        )}
      </div>
    ),
  },
  {
    id: "totalSupply",
    title: "Total Supply",
    key: "totalSupply",
    render: (text) => (
      <span>
        {text?.totalSupply
          ? text?.native == true
            ? formatValue(noExponential(toFixed(Number(text?.totalSupply))))
            : formateTotalSupply(
                noExponential(
                  Number(text?.totalSupply) / 10 ** Number(text?.decimal)
                )
              )
          : "-"}
      </span>
    ),
  },
  {
    id: "Holders",
    title: "Holders",
    key: "Holders",
    render: (text) => <span>{text?.holders ? text?.holders : "-"}</span>,
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
            <Link href={`${Routes.Tx_Hash()}${text?.txhash}`}>
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
    title: "Timestamp",
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
            href={`${Routes.Tx_Hash()}${text?.txhash}`}
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
    title: "Timestamp",
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
    render: (text) => {
      const value = text?.commission || text?.commissionRate;

      const comission = noExponential(Number(value));

      return <span>{value ? Number(comission) * 100 + " %" : "-"}</span>;
    },
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
            <span className="failedtrans"> Inactive </span>
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
  // {
  //   title: "Token Name",
  //   key: "name",
  //   render: (text) => (
  //     <span className="">
  //       {text?.tokenName ? capitalizeWord(text?.tokenName) : "-"}
  //     </span>
  //   ),
  // },
  // {
  //   title: "Symbol",
  //   key: "symbol",
  //   render: (text) => (
  //     <span className="">{text?.tokenSymbol ? text?.tokenSymbol : "-"}</span>
  //   ),
  // },
  {
    title: "Txn Hash ",
    dataIndex: "txhash",
    key: "txhash",
    render: (text) => (
      <Link
        className="bghash"
        href={`${Routes.Tx_Hash()}${text}`}
        rel="noopener noreferrer"
      >
        {getAddress(text)}
      </Link>
    ),
  },
  // {
  //   title: "Block",
  //   dataIndex: "blocknumber",
  //   key: "blocknumber",
  //   render: (text) => (
  //     <Link
  //       className="bghash"
  //       href={`${Routes.BLOCK_NO}${text}`}
  //       rel="noopener noreferrer"
  //     >
  //       {text}
  //     </Link>
  //   ),
  // },
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
            <div className="iconandlink">
              <Link href={`${Routes.Tx_ADDRESS}${text?.toAddress}`}>
                {getAddress(text?.toAddress)}
              </Link>
              <span>
                <CopyText text={text?.toAddress} />
              </span>
            </div>
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
    key: "value",
    render: (text) => {
      return text?.value ? formatValue(text?.value) : "0";
    },
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

export const dVPNColumn = [
  {
    title: "Txn Hash ",
    dataIndex: "txhash",
    key: "txhash",
    render: (text) => (
      <div className="addressText">
        <Link
          className="bghash"
          href={`${Routes.Tx_Hash()}${text}`}
          rel="noopener noreferrer"
        >
          {getAddress(text)}
        </Link>
        <CopyText text={text} />
      </div>
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
    title: "Type ",
    key: "type",
    render: (text) => (text?.type ? capitalizeWord(text?.type) : "-"),
  },
  {
    title: "Amount",
    key: "value",
    render: (text) => {
      return `${text?.value ? formatValue(text?.value) : "0"} ${currencyName}`;
    },
  },
  {
    title: "Fee",
    key: "txFee",
    render: (text) => (
      <span className="">
        {text?.txFee ? `${text.txFee}` : "0"} {currencyName}
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
export const accountsColumns = (currentPage = 1, tableLimit) => [
  {
    id: "accAddress",
    title: "Address",
    key: "accAddress",
    render: (text) => (
      <div className="txnHashcopy">
        {text?.accAddress ? (
          <Tooltip title={text?.accAddress}>
            <Link
              href={`${Routes.Tx_ADDRESS}${text?.accAddress}`}
              className="addressWidth"
            >
              {text?.accAddress}{" "}
            </Link>
          </Tooltip>
        ) : (
          "-"
        )}
        <span>
          <CopyText text={text?.accAddress} />
        </span>
      </div>
    ),
  },
  {
    title: "Amount",
    key: "price",
    render: (text) => {
      if (!text?.price) return "-";

      const fullAmount = text.price;
      const formatted = formatToTwoDecimals(text.price);

      return (
        <Tooltip title={`${fullAmount} ${currencyName}`}>
          <span>{`${formatted} ${currencyName}`}</span>
        </Tooltip>
      );
    },
  },
  {
    id: "createdAt",
    title: "Timestamp",
    key: "createdAt",
    render: (text) =>
      text?.createdAt ? (
        <span className="timestamp">
          {renderTime(text?.createdAt)}
          <span>{convertToDateTime(text?.createdAt)}</span>
        </span>
      ) : (
        "-"
      ),
  },
];

export const activeUsersColumns = (currentPage = 1, tableLimit = 10) => [
  {
    title: "Address",
    key: "accAddress",
    render: (_text, record) => {
      const accAddress = record?.base_session?.acc_address;

      if (!accAddress) {
        return "-";
      }

      return (
        <div className="iconandlink activeSessionAddress">
          <Tooltip title={accAddress}>
            <Link
              style={{ minWidth: 420 }}
              href={`${Routes.Tx_ADDRESS}${accAddress}`}
            >
              {accAddress}
            </Link>
          </Tooltip>
          <span>
            <CopyText text={accAddress} />
          </span>
        </div>
      );
    },
  },
  {
    title: "Bandwidth Consumed",
    dataIndex: "base_session",
    key: "bandwidth",
    render: (base_session) => {
      const totalUsed =
        Number(base_session?.download_bytes || 0) +
        Number(base_session?.upload_bytes || 0);

      const maxBytes = Number(base_session?.max_bytes || 0);

      if (!maxBytes) return "0%";

      const consumed = (totalUsed / maxBytes) * 100;
      return (
        <Tooltip
          overlayClassName="Bandwidth"
          title={`${noExponential(consumed)}%`}
        >
          {`${consumed.toFixed(2)}% `}
        </Tooltip>
      );
    },
  },
  {
    title: "Duration",
    dataIndex: "base_session",
    key: "duration",
    render: (base_session) => {
      if (!base_session?.duration) return "-";

      // remove "s" and convert to number
      const totalSeconds = parseFloat(base_session?.duration.replace("s", ""));

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);

      return `${hours}h ${minutes}m ${seconds}s`;
    },
  },
];
export const solverColumn = [
  {
    id: "number",
    title: "No.",
    key: "number",
    render: (_text, _record, index) => index + 1,
  },
  {
    id: "solvername",
    title: "Solver Name",
    dataIndex: "solver_name",
    key: "solver_name",
  },
  {
    id: "nodeaddress",
    title: "Node Address",
    dataIndex: "solver_id",
    key: "solver_id",
    render: (text) => (
      <>
        <div className="iconandlink blockLinkItems">
          <Tooltip title={text}>{getAddress(text)}</Tooltip>
          <span>
            <CopyText hoverText={"Node Address"} text={text}></CopyText>
          </span>
        </div>
      </>
    ),
  },
  // {
  //   id: "location",
  //   title: "Location",
  //   dataIndex: "location",
  //   key: "location",
  // },
  {
    id: "status",
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (text) => (
      <span
        className={`${text === "active" ? "activeStatus" : "inactiveStatus"}`}
      >
        {capitalizeFirstLetter(text)}
      </span>
    ),
  },
];
