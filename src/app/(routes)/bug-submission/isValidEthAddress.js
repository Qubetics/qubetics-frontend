import { ethers } from "ethers";

export function isValidEthereumAddress(address) {
  return ethers.isAddress(address);
}
