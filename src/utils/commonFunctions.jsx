import {
  BTC_EXPLORER_URL,
  CHAIN_ASSET_MAP,
  ETH_EXPLORER_URL,
  TICS_EXPLORER_URL,
  toFixedWithoutRounding,
} from "@/constant/constant";
import BigNumber from "bignumber.js";

Number.prototype.noExponents = function () {
  const value = this.toString();
  if (!value.includes("e")) return value;

  const [base, exponentPart] = value.toLowerCase().split("e");
  const exponent = parseInt(exponentPart, 10);
  const negative = this < 0 ? "-" : "";
  const [integerPart, decimalPart = ""] = base.replace("-", "").split(".");

  if (exponent < 0) {
    const zeroCount = Math.abs(exponent) - integerPart.length;
    return (
      negative +
      "0." +
      "0".repeat(Math.max(0, zeroCount)) +
      integerPart +
      decimalPart
    );
  } else {
    if (exponent >= decimalPart.length) {
      const zeros = exponent - decimalPart.length;
      return negative + integerPart + decimalPart + "0".repeat(zeros);
    } else {
      return (
        negative +
        integerPart +
        decimalPart.slice(0, exponent) +
        "." +
        decimalPart.slice(exponent)
      );
    }
  }
};

export const noExponential = (num) => {
  if (num === null || num === undefined || num === "") return "0";
  return new BigNumber(num).toFixed();
};

export function noExponentsValue(number) {
  if (number === 0 || number === "0" || number === "0x0") return "0";
  if (!number) return "0";

  try {
    const bn = new BigNumber(number);
    if (bn.isNaN()) return "0";
    // Using toFixed(18) to match the "up to 18" requirement while stripping trailing zeros
    return bn.toFixed(18).replace(/\.?0+$/, "");
  } catch (e) {
    return "0";
  }
}

const truncateDecimals = (value, decimals = 4) => {
  const factor = Math.pow(10, decimals);
  return Math.trunc(value * factor) / factor;
};

export const formatMillionNumber = (num, precision = 3) => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  const format = (value, suffix) => {
    const truncated = truncateDecimals(value, precision);
    return `${truncated}${suffix}`;
  };

  if (num >= 1e12) return format(num / 1e12, " T");
  if (num >= 1e9) return format(num / 1e9, " B");
  if (num >= 1e6) return format(num / 1e6, " M");
  if (num >= 1e3) return format(num / 1e3, " K");
  if (num > 0 && num < 1) return num.toString();
  return `${truncateDecimals(num, precision)}`;
};

const reduceValueLength = (apr = "", startLen = 4, endLen = 3) => {
  if (apr?.length > 9) {
    return `${apr?.substring(0, startLen)}...${apr?.substring(
      apr?.length - endLen,
      apr?.length
    )}`;
  } else {
    return apr;
  }
};
export default reduceValueLength;

export function simplifyNumber(input) {
  // Convert input to a number if it's a string
  const num = Number(input);

  // Check if the input is a valid number
  if (isNaN(num)) {
    return "Invalid input. Please provide a valid number or numeric string.";
  }

  let simplifiedNumber = num.toString();

  // Check if the string representation contains an 'e' indicating exponential notation
  if (simplifiedNumber.includes("e")) {
    // Convert the number to a fixed-point notation
    simplifiedNumber = num
      .toFixed(Math.max(0, -Math.floor(Math.log10(Math.abs(num)))))
      .replace(/\.?0+$/, "");
  }

  return simplifiedNumber;
}

export const capitalizeWord = (str) => {
  const specialWords = [
    "coin_transfer",
    "contract_creation",
    "contract_transfer",
    "contract_execute",
    "contract_upload",
    "end_request",
    "start_request",
    "start_subscription",
    "coin_receive",
  ]; // Add more words as needed
  const name = str?.toLowerCase();
  let modStr;
  if (specialWords?.includes(name)) {
    // Special capitalization rules for specific words
    modStr = name
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("_");
  } else {
    // Default capitalization for other words
    modStr = name[0].toUpperCase() + name.slice(1);
  }
  return modStr;
};

export function toFixed(num = 0, fixed = 0) {
  return new BigNumber(num)
    .decimalPlaces(fixed, BigNumber.ROUND_FLOOR)
    .toFixed();
}

export const randomNoGenerator = () => {
  let num = Math.random() * (6.0 - 5.8) + 5.8;
  return num.toFixed(2);
};
export const formatDecimal = (number) => {
  if (!number || isNaN(number)) return "0";

  return new BigNumber(number)
    .decimalPlaces(5, BigNumber.ROUND_FLOOR)
    .toFixed();
};
export const formateTotalSupply = (num) => {
  if (!num || num === null || num === undefined) return 0;
  let formattedNumber;
  switch (true) {
    case num >= 1e12:
      formattedNumber = formatDecimal(num / 1e12) + " T";
      break;
    case num >= 1e9:
      formattedNumber = formatDecimal(num / 1e9) + " B";
      break;
    case num >= 1e6:
      formattedNumber = formatDecimal(num / 1e6) + " M";
      break;
    case num >= 1e3:
      formattedNumber = formatDecimal(num / 1e3) + " K";
      break;
    default:
      formattedNumber = formatDecimal(num);
      break;
  }

  return formattedNumber;
};

export function noExponentialFixed(num) {
  return new BigNumber(num).decimalPlaces(5, BigNumber.ROUND_FLOOR).toFixed();
}

export const getOffset = (page = 1, limit = 10) => {
  if (page < 1) page = 1;
  return (page - 1) * limit;
};

export function formatStatus(value) {
  if (!value) return "";

  const lower = value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatText(input) {
  if (!input) return "";

  const words = input.replace(/_/g, " ").toLowerCase().split(" ");
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  return words.join(" ");
}

export const formatToTwoDecimals = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (isNaN(num)) return "-";
  return num.toFixed(2); // always 2 decimal places
};

export const checkStatus = (value) => {
  switch (value) {
    case 0:
      return "Fail";
    case 1:
      return "Confirm";
    case 2:
    case 3:
      return "Pending";
    default:
      return "-";
  }
};

export const transferType = (value) => {
  switch (value) {
    case 0:
      return "Contract";
    case 1:
      return "Token Transfer";
    default:
      return "-";
  }
};

export const destinationTxn = (type, value) => {
  switch (type) {
    case "btc":
      return `${BTC_EXPLORER_URL}testnet4/tx/${value}`;
    case "tics":
      return `${TICS_EXPLORER_URL}tx/${value}`;
    case "usdt":
    case "usdc":
    case "sepolia":
      return `${ETH_EXPLORER_URL}tx/${value}`;
    default:
      return null;
  }
};

export const formatToken = (type, value) => {
  let calValue;

  switch (type?.toLowerCase()) {
    case "btc":
      calValue = value / 1e8;
      break;
    case "eth":
    case "tics":
      calValue = value / 1e18;
      break;
    case "usdc":
    case "usdt":
      calValue = value / 1e6;
      break;
    default:
      return "-";
  }

  const formatted = toFixedWithoutRounding(calValue, 10);
  return noExponential(formatted);
};

export function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const fetchTokenPrices = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,qubetics&vs_currencies=usd"
    );

    if (response.ok) {
      const data = await response.json();
      const prices = {
        btc: data?.bitcoin?.usd,
        tics: data?.qubetics?.usd,
      };

      return prices;
    }
  } catch (error) {
    console.error("Failed to fetch token prices:", error);
  }
};

export const calculateLiquidityUSD = async (liquidities) => {
  if (!liquidities || liquidities.length === 0) return 0;
  const price = await fetchTokenPrices();

  return liquidities.reduce((totalUSD, { chain_id, total }) => {
    const asset = CHAIN_ASSET_MAP[chain_id];
    if (!asset) return totalUSD;

    return totalUSD + total * price[asset];
  }, 0);
};

export const getTokenIcon = (type) => {
  let url;
  switch (type?.toLowerCase()) {
    case "btc":
      url = "/Bitcoin.svg";
      break;
    case "tics":
      url = "/Qubetics.svg";
      break;
    default:
      url = null;
      break;
  }

  return url ? <img src={url} alt="icon" width={25} height={25} /> : null;
};

export const truncateString = (str, front = 10, back = 10) => {
  if (!str) return "";

  if (str.length <= front + back) return str;

  return `${str?.slice(0, front)}...${str?.slice(-back)}`;
};

export const getTooltipContent = (token, rawValue, formatted) => {
  if (!token) return "";

  const lowerToken = token.toLowerCase();

  if (lowerToken === "btc" && rawValue) {
    const btcPrice = parseFloat(rawValue) / 1e8;
    return `${btcPrice.toFixed(8).replace(/\.?0+$/, "")} BTC`;
  }
  return `${formatted} ${token.toUpperCase()}`;
};

export const getExplorerUrl = (network, transactionHash) => {
  const normalizedNetwork = (network || "").toLowerCase();

  if (normalizedNetwork === "bitcoin") {
    return `${BTC_EXPLORER_URL}testnet4/tx/${transactionHash}`;
  } else if (normalizedNetwork === "qubetics") {
    return `${TICS_EXPLORER_URL}tx/${transactionHash}`;
  }

  // fallback
  return "";
};
export const isValidAlphaNumeric = (value) => {
  const isAlphaNumeric = /^[a-zA-Z0-9]+$/.test(value);
  return value.length >= 7 && isAlphaNumeric;
};

export const getTXNRoute = () => {
  const chainType =
    typeof window !== "undefined"
      ? localStorage.getItem("chainType")
      : "EVM Chain";
  if (chainType === "EVM Chain") {
    return "/tx/";
  } else {
    return "/txn/";
  }
};
