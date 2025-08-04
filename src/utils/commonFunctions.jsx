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
    return `${apr.substring(0, startLen)}...${apr?.substring(
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

  // Convert the number to a string without exponential notation
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
