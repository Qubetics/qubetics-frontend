Number.prototype.noExponents = function () {
  try {
    var data = String(this).split(/[eE]/);
    if (data.length === 1) return data[0];
    var z = "",
      sign = this < 0 ? "-" : "",
      str = data[0].replace(".", ""),
      mag = Number(data[1]) + 1;
    if (mag < 0) {
      z = sign + "0.";
      while (mag++) z += "0";
      return z + str.replace(/^\-/, "");
    }
    mag -= str.length;
    while (mag--) z += "0";
    return str + z;
  } catch (error) {}
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

export const formatMillionNumber = (num) => {
  if (!num && num !== 0) return "0";

  let formattedNumber;

  switch (true) {
    case num >= 1e12:
      formattedNumber = (num / 1e12).toFixed(4).replace(/\.?0+$/, "") + " T";
      break;
    case num >= 1e9:
      formattedNumber = (num / 1e9).toFixed(4).replace(/\.?0+$/, "") + " B";
      break;
    case num >= 1e6:
      formattedNumber = (num / 1e6).toFixed(4).replace(/\.?0+$/, "") + " M";
      break;
    case num >= 1e3:
      formattedNumber = (num / 1e3).toFixed(4).replace(/\.?0+$/, "") + " K";
      break;
    default:
      formattedNumber = Number(num)
        .toFixed(4)
        .replace(/\.?0+$/, "");
      break;
  }

  return formattedNumber;
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
