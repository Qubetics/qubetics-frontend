import {
  BTC_EXPLORER_URL,
  CHAIN_ASSET_MAP,
  ETH_EXPLORER_URL,
  TICS_EXPLORER_URL,
} from "@/constant/constant";

Number.prototype.noExponents = function () {
  const value = this.toString();
  if (!value.includes("e")) return value;

  const [base, exponentPart] = value.toLowerCase().split("e");
  const exponent = parseInt(exponentPart, 10);
  const negative = this < 0 ? "-" : "";
  const [integerPart, decimalPart = ""] = base.replace("-", "").split(".");

  let digits = integerPart + decimalPart;

  if (exponent < 0) {
    const zeroCount = Math.abs(exponent) - integerPart.length;
    return negative + "0." + "0".repeat(zeroCount > 0 ? zeroCount : 0) + digits;
  } else {
    const decimalShift = exponent - decimalPart.length;
    return (
      negative +
      digits +
      (decimalShift >= 0 ? "0".repeat(decimalShift) : "")
        .padEnd(exponent + 1, "0")
        .slice(0, exponent + 1)
    );
  }
};

export const noExponential = (num) => {
  return Number(num).noExponents();
};

export function noExponentsValue(number) {
  if (number == 0) return 0;
  if (isNaN(number)) return 0; // Handle invalid input

  // If the number is very small or very large, handle it as a fixed-point number
  if (Math.abs(number) < 1e-6 || Math.abs(number) > 1e21) {
    return parseFloat(number.toFixed(6)); // Convert to fixed-point with 18 decimals
  }

  // Convert number to string and split into coefficient and exponent parts
  const [coefficient, exponent] = String(number).split(/[eE]/);

  // If there's no exponent part, return the original number
  if (!exponent) return Number(number);

  // Handle cases with exponents
  const mag = Number(exponent);
  const sign = number < 0 ? -1 : 1; // Retain the original sign

  // Calculate the value without exponential notation
  const coefficientValue = parseFloat(coefficient.replace(".", ""));
  const decimalPlaces = coefficient.includes(".")
    ? coefficient.split(".")[1].length
    : 0;

  const numericValue =
    mag > 0
      ? coefficientValue * 10 ** (mag - decimalPlaces)
      : coefficientValue / 10 ** (Math.abs(mag) + decimalPlaces);

  return sign * numericValue;
}

const truncateDecimals = (value, decimals = 4) => {
  const factor = Math.pow(10, decimals);
  return Math.trunc(value * factor) / factor;
};

export const formatMillionNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0";

  const format = (value, suffix) => {
    const truncated = truncateDecimals(value, 4);
    return `${truncated}${suffix}`;
  };

  if (num >= 1e12) return format(num / 1e12, " T");
  if (num >= 1e9) return format(num / 1e9, " B");
  if (num >= 1e6) return format(num / 1e6, " M");
  if (num >= 1e3) return format(num / 1e3, " K");
  if (num > 0 && num < 1) return num.toString();
  return `${truncateDecimals(num, 4)}`;
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
  const fixedVal = Math.pow(10, fixed);
  return noExponential(Math.floor(num * fixedVal) / fixedVal);
}

export const randomNoGenerator = () => {
  let num = Math.random() * (6.0 - 5.8) + 5.8;
  return num.toFixed(2);
};
export const formatDecimal = (number) => {
  let [beforeDecimal, afterDecimal] = number.toString().split(".");
  let afterDecimalFive = afterDecimal ? afterDecimal.slice(0, 5) : "";
  if (afterDecimal === undefined) return beforeDecimal;
  return beforeDecimal + "." + afterDecimalFive;
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
  return num.toFixed(5).replace(/\.?0+$/, "");
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
      return `${BTC_EXPLORER_URL}tx/${value}`;
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

  const formatted = parseFloat(calValue.toFixed(10));
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

export const BLOCKCHAIN_EXPLORER_URLS = {
  bitcoin: "https://mempool.space/testnet/tx/",
  qubetics: "https://testnet-v2.qubetics.work/tx/",
};

export const getExplorerUrl = (network, transactionHash) => {
  const normalizedNetwork = (network || "").toLowerCase();

  console.log("normalizedNetwork", normalizedNetwork);

  if (normalizedNetwork === "bitcoin") {
    return `${BLOCKCHAIN_EXPLORER_URLS.bitcoin}${transactionHash}`;
  } else if (normalizedNetwork === "qubetics") {
    return `${BLOCKCHAIN_EXPLORER_URLS.qubetics}${transactionHash}`;
  }

  // fallback
  return "";
};
export const  isValidAlphaNumeric=(value)=> {
  const isAlphaNumeric = /^[a-zA-Z0-9]+$/.test(value);
  return value.length >= 7 && isAlphaNumeric ;
}
