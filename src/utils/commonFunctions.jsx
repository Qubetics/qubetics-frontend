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

export const formatMillionNumber = (num) => {
  let formattedNumber;

  switch (true) {
    case num >= 1e12:
      formattedNumber = (num / 1e12).toFixed(2) + " T";
      break;
    case num >= 1e9:
      formattedNumber = (num / 1e9).toFixed(2) + " B";
      break;
    case num >= 1e6:
      formattedNumber = (num / 1e6).toFixed(2) + " M";
      break;
    case num >= 1e3:
      formattedNumber = (num / 1e3).toFixed(2) + " K";
      break;
    default:
      formattedNumber = num;
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
  let num = Math.random() * (1.1 - 0.8) + 0.8;
  return noExponential(num.toFixed(1));
};
