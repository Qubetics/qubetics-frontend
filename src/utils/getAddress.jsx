const getAddress = (address = "", startLen = 7, endLen = 7) => {
  if (
    address === undefined ||
    address === null ||
    address === "" ||
    address === "N/A"
  ) {
    return "";
  }

  // If address is shorter than or equal to the combined length, return as is
  if (address.length <= startLen + endLen) {
    return address;
  }

  return `${address?.substring(0, startLen)}...${address?.substring(
    address.length - endLen,
    address.length
  )}`;
};

export default getAddress;

export const faucetAddress = (address = "", startLen = 22, endLen = 22) => {
  return `${address?.substring(0, startLen)}...${address?.substring(
    address.length - endLen,
    address.length
  )}`;
};

export const imgUrl = (address = "", startLen = 10, endLen = 10) => {
  return `${address?.substring(0, startLen)}...${address?.substring(
    address.length - endLen,
    address.length
  )}`;
};
