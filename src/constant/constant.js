"use client";

import Link from "next/link";

export const EXPLORER_API_URL = process.env.NEXT_PUBLIC_EXPLORER_API_URL;
export const EXPLORER_CONTRACT_VERIFY_URL =
  process.env.NEXT_PUBLIC_CONTRACT_VERIFY_URL;
export const WEB_PROVIDER_URL = process.env.NEXT_PUBLIC_METAMASK_NETWROK_URL;
export const NATIVE_EXPLORER_API_URL =
  process.env.NEXT_PUBLIC_NATIVE_EXPLORER_API_URL;
export const EXPLORER_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const NATIVE_EXPLORER_SOCKET_URL =
  process.env.NEXT_PUBLIC_NATIVE_SOCKET_URL;
export const EXPLORER_METAMASK_NAVIGATION =
  process.env.NEXT_PUBLIC_METAMASK_EXPLORER_NAVIGATE;
export const EXPLORER_METAMASK_NETWORK_URL =
  process.env.NEXT_PUBLIC_METAMASK_NETWROK_URL;
export const EXPLORER_META_NETWORK_CHAIN_ID =
  process.env.NEXT_PUBLIC_QUBETICS_CHAINID;
export const EXPLORER_CURRENCY_NAME =
  process.env.NEXT_PUBLIC_QUBETICS_CURRENCY_NAME;
export const BLOCK_TIME = process.env.NEXT_PUBLIC_EXPLORER_BLOCK_TIME;
export const EXPLORER_VIDEO_LINKS =
  process.env.NEXT_PUBLIC_EXPLORER_VIDEO_LINKS;
export const EXPLORER_CHAIN_NAME = process.env.NEXT_PUBLIC_QUBETICS_CHAIN_NAME;
export const EXPLORER_NETWORK_NAME = process.env.NEXT_PUBLIC_NETWORK_NAME;
export const METAMASK_CHAIN_NAME =
  process.env.NEXT_PUBLIC_QUBETICS_CHAIN_NAME +
  " " +
  process.env.NEXT_PUBLIC_NETWORK_NAME;
export const SHOW_FAUCET = process.env.NEXT_PUBLIC_SHOW_FAUCET;
export const FAUCET_AMOUNT = process.env.NEXT_PUBLIC_FAUCET_AMOUNT;
export const GoogleKey = process.env.NEXT_PUBLIC_GOOGLE_CAPTCHA_KEY;
export const METAMASK_DAPP_URL = process.env.NEXT_PUBLIC_METAMASK_DAPP_URL;
//  Api Data status
export const InitStatus = "Init";
export const FetchingStatus = "Fetching";
export const SuccessStatus = "Success";
export const ErrorStatus = "Error";

export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
};

/*Blocks & Transactions Page Size */
export const tableLimit = 10;
export const totalTableDataLength = 50;

export const pageNo = 1;
export const dashboardCount = 6;
export const HEADER_VALUE = "headerValue";
export const BLOCKCHAIN = "Blockchain";

export const typesOfTransactions = {
  coinTransfer: "COIN_TRANSFER",
  contractTransfer: "CONTRACT_TRANSFER",
  contractCreation: "CONTRACT_CREATION",
  contractUpload: "CONTRACT_UPLOAD",
  contractExecute: "CONTRACT_EXECUTE",
};

export const validationtValue = {
  START_ADDRESS: "0x",
  FAUCET_PLACEHOLDER: "Enter your wallet address",
  FACUCET_AMOUNT_UPTO: 20,
  BLOCKCHAIN: "Blockchain",
};

export const contractTypes = {
  ERC_20: "ERC-20",
  ERC_721: "ERC-721",
  UNKNOWN: "UNKNOWN",
};

export const chain = {
  NATIVE: "Native Chain",
  EVM: "EVM Chain",
};

export const Messages = {
  //Metamask
  Install_Metamask: `Metamask is not installed. Please install Metamask. Or refresh the browser`,
  Retrive_Meta_Account: `Cannot retrieve any account. Please refresh the browser`,
  Same_Network: `You are already on the ${EXPLORER_CHAIN_NAME} network.`,
  Successfully_Switched: `You have successfully switched to ${EXPLORER_CHAIN_NAME} network.`,
  Network_Added: `You have successfully switched to ${EXPLORER_CHAIN_NAME} network.`,
  Network_Add_Error: `Error adding ${EXPLORER_CHAIN_NAME} network: `,

  //faucet
  ENTER_WALLET_ADDRESS: "Please Enter Wallet Address",
  INVALID_ADDRESS: "Invalid Wallet Address",
  ENTER_AMOUNT: "Please Enter Amount Value",
  MAX_VALUE_EXCEED: "Max value exceeded please enter a lower value",
  INVALID_AMOUNT: "Invalid Wallet Amount Value",
  Faucet_REQUEST_LIMIT: "The drops are limited to 1 request every 24 hours",
  FAUCET_AMOUNT_LIMIT: "You can request up to 5 coins",
};

export const tooltipConstant = {
  FAUCET: `These ${EXPLORER_CHAIN_NAME} coins are for the Testnet and have no monetary value.`,
  TRANSACTION_HISTORY_GRAPH: `The graph shows historical data for the number of transactions on the ${EXPLORER_CHAIN_NAME} blockchain in different time periods.`,
  TOKEN_PRICE_GRAPH: `${EXPLORER_CHAIN_NAME} coin historical price in USD.`,
  COIN_TRANSACTION_GRAPH: ` Number of transactions for ${EXPLORER_CHAIN_NAME} coin on the blockchain.`,
  TOTAL_CONTRACTS_GRAPH: `Total number of smart contracts deployed successfully.`,
  TOTAL_ACCOUNT: `Number of wallet addresses created on the ${EXPLORER_CHAIN_NAME} network that have completed at least one transaction.`,
  TOTAL_TRANSACTION_COUNT: `Total transaction count on the network since genesis block.`,
  GAS_FEES_PAID: `Total fees accumulated on the ${EXPLORER_CHAIN_NAME} network.`,
  COIN_BALANCE_TOOLTIP: `${EXPLORER_CHAIN_NAME} coin balance this particular address holds.`,
  QUBETICS_VALUE_TOOLTIP: `Show the ${EXPLORER_CHAIN_NAME} coin balance in dollar value (USD)`,
  ADDRESS_TRANSACTION_COUNT: `Number of transaction sent by the address.`,
  MARKET_CAP: `The total market value of a ${EXPLORER_CHAIN_NAME} coin circulating supply. Market cap = Current price x Circulating supply`,
  CIRCULATION_SUPPLY: `The amount of ${EXPLORER_CHAIN_NAME} coins in circulation and in the hands of the general public.`,
  VALIDATORS: `Total number of Active validators on the ${EXPLORER_CHAIN_NAME} network.`,
  AVERAGE_APR: `APR is an estimate % of rewards you will earn while staking ${EXPLORER_CHAIN_NAME} coins over the annual period.. APR is adjusted daily and the estimated rewards may be different from the actual rewards generated.`,
  INFLATION: `Inflation in blockchain refers to the gradual increase in the total supply of ${EXPLORER_CHAIN_NAME} coin over time`,
};

export const Banner = "USDC is live on Mainnet";

export const Routes = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  BLOCKS: "/blocks",
  BLOCK_NO: "/blocks/",
  TRANSACTIONS: "/tx",
  Tx_ADDRESS: "/address/",
  Tx_Hash: "/tx/",
  FAUCET: "/faucet",
  NODES: "/nodes",
  NOT_FOUND: "/notfound",
  CONTRACTS: "/contract",
  CONTRACT_DETAIL: "/contract/",
  CONTRACT_VERIFICATOIN: "/contract/verify",
  TOKEN: "/token",
  VALIDATORS: "/validators",
  STATS: "/charts",
  TOKEN_TXNS: "/tokentxns",
  TOKEN_ICON: "/tokenicon",
};
export const graphUrl = {
  coin_transfer: "explorer/graph/coin-transfer",
  total_account: "explorer/graph/account",
  token_price: "explorer/graph/token-price",
  txn_fee: "explorer/graph/tx-fee",
};
export const verifyContractConstant = {
  INFO: "A simple and structured interface for verifying smart contractsthat fit in a single file",
  END_POINT_LINK: " For programmatic contract verification, check out the",
  COMPILE: "If the contract compiles correctly at",
  CORRECT_COMPILE: "it should also compile correctly here.",
  MISC_SETTING: "Misc Settings (Runs, EvmVersion setting)",
  INPUT_LABEL: "Please enter the Contract Address you would like to verify",
  SELECT_COMPILE_TYPE: "Please select Compiler Type",
  SELECT_COMPILE_VERSION: "Please select Compiler Version",
  SELECT_LICENSE_TYPE: "Please select Open Source License Type",
  VERIFY_AND_PUBLISH_CONTRACT: "Verify And Publish Contract",
  LISTING_ONE:
    "Source code verification provides transparency for users interacting with smart contracts. By uploading the source code, Etherscan will match the compiled code with that on the blockchain. Just like contracts, a 'smart contract' should provide end users with more information on what they are 'digitally signing' for and give users an opportunity to audit the code to independently verify that it actually does what it is supposed to do.",
  LITING_TWO:
    "Please be informed that advanced settings (e.g. bytecodeHash: 'none' or viaIR: 'true') can be accessed via Solidity (Standard-Json-Input) verification method. More information can be found under Solidity's 'Compiler Input and Output JSON Description' documentation section.",
};

export const verificationStatus = {
  PENDING_VERIFICATION: "Pending verification",
  PARTIAL_VERIFIED: "Partial Verified",
  FULLY_VERIFIED: "Fully Verified",
  REJECTED_VERIFICATION: "Rejected Verification",
};

export const solidityFile = {
  SINGLE_FILE: "solidity-single-file",
  JSON_INPUT: "solidity-standard-json-input",
  MULTI_PART_FILES: "solidity-multi-part-files",
};

export const CONTARCT_NULL_ADDRESS =
  "0x0000000000000000000000000000000000000000";

export const nodePerformanceData = (blockHeight) => {
  [
    { value: blockHeight, label: "Block Height" },
    { value: "15", label: "Total Nodes" },
    { value: "3.00 Sec", label: "Last Blocks" },
    { value: "6", label: "Countries" },
  ];
};
export const tooltipContent = {
  block_Height: "Total number of blocks produced since the genesis block.",
  bonded_Coins: "Total amount of Qubetics staked in the network.",
  total_Nodes: "The total number of nodes connected to the Qubetics network.",
  last_Block: "The time when the last block is finalized in UTC format.",
  TPB: " Transactions per block. Display the average number of transactions recorded in a block during the last three seconds.",
  Countries: "The number of countries from which nodes are connected.",
  finalized_Block:
    "A block confirmed by the network as permanent and immutable, ensuring it cannot be altered or reversed.",
};
export function BlockchainHeaderFunction(currentPath, onClick) {
  const blockchainHeader = [
    {
      key: "1",
      value: "Blocks",
      className: currentPath === Routes.BLOCKS ? "activeOptions" : "",
      label: (
        <Link onClick={onClick} href="/blocks">
          Blocks
        </Link>
      ),
    },
    {
      key: "2",
      value: "Transactions",
      className: currentPath === Routes.TRANSACTIONS ? "activeOptions" : "",
      label: (
        <Link onClick={onClick} href="/tx">
          Transactions
        </Link>
      ),
    },
  ];
  return blockchainHeader;
}

/*BlockChain Header*/
export const blockchainHeader = [
  {
    key: "1",
    value: "Blocks",
    label: <Link href="/blocks">Blocks</Link>,
  },

  {
    key: "2",
    value: "Transactions",
    label: <Link href="/tx">Transactions</Link>,
  },
  {
    key: "3",
    value: "Validator",
    label: <Link href="/validators">Validators</Link>,
  },
  {
    key: "4",
    value: "Nodes",
    label: <Link href="/nodes">Nodes</Link>,
  },
];

/*Contract Header*/
export const contractHeaderFunction = (currentPath, onClick) => {
  const contractHeader = [
    {
      key: "1",
      value: "AllContracts",
      className: currentPath === Routes.CONTRACTS ? "activeOptions" : "",
      label: (
        <Link onClick={onClick} href="/contract">
          All Contracts
        </Link>
      ),
    },

    {
      key: "2",
      value: "Verifiedcontract",
      className: currentPath === Routes.TOKEN_ICON ? "activeOptions" : "",
      label: (
        <Link onClick={onClick} href="/tokenicon">
          Token Icon
        </Link>
      ),
    },

    {
      key: "2",
      value: "Verifiedcontract",
      className:
        currentPath === Routes.CONTRACT_VERIFICATOIN ? "activeOptions" : "",
      label: (
        <Link onClick={onClick} href="/contract/verify">
          Verify Contract
        </Link>
      ),
    },
  ];
  return contractHeader;
};

export const statsChartsFunction = (currentPath, isEvm, onClick) => {
  if (isEvm) {
    return [
      {
        key: "1",
        value: "Charts",
        className: currentPath === Routes.STATS ? "activeOptions" : "",
        label: (
          <Link href="/charts" onClick={onClick}>
            Charts
          </Link>
        ),
      },

      {
        key: "2",
        value: "Top Token",
        className: currentPath === Routes.TOKEN ? "activeOptions" : "",
        label: (
          <Link href="/token" onClick={onClick}>
            Top Token
          </Link>
        ),
      },
      {
        key: "3",
        value: "Token Transfers",
        className: currentPath === Routes.TOKEN_TXNS ? "activeOptions" : "",
        label: (
          <Link href="/tokentxns" onClick={onClick}>
            Token Transfers
          </Link>
        ),
      },
    ];
  } else {
    return [
      {
        key: "1",
        value: "Charts",
        className: currentPath === Routes.STATS ? "activeOptions" : "",
        label: (
          <Link onClick={onClick} href="/charts">
            Charts
          </Link>
        ),
      },

      {
        key: "2",
        value: "Top Token",
        className: currentPath === Routes.TOKEN ? "activeOptions" : "",
        label: (
          <Link onClick={onClick} href="/token">
            Top Token
          </Link>
        ),
      },
    ];
  }
};
export const generateData = (timeRange) => {
  const data = [];
  const now = new Date();
  let interval, periods;

  switch (timeRange) {
    case "7 Days": // 7 days
      interval = 1 * 24 * 60 * 60 * 1000; // 1 day in milliseconds
      periods = 7;
      break;
    case "30 Days": // 30 days
      interval = 1 * 24 * 60 * 60 * 1000; // 1 day in milliseconds
      periods = 30;
      break;
    case "1 Year": // 1 year (12 months)
      interval = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      periods = 12;
      break;
    default:
      throw new Error("Invalid time range specified");
  }

  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * interval);
    const formattedDate = date.toISOString();
    data.push({
      createdAt: formattedDate,
      count: 0, // Dummy data
    });
  }
  return data;
};
export const convertArray = (writeObj) => {
  let outPutArray = Object.keys(writeObj).map((t) => {
    if (typeof writeObj[t] == "object") {
      return convertArray(writeObj[t]);
    } else return writeObj[t];
  });

  return outPutArray;
};
export const createTupleObject = (input) => {
  const newObj = {};

  Object.keys(input).forEach((key) => {
    if (key.includes(".")) {
      const [firstKey, ...restKeys] = key.split(".");
      const lastKey = restKeys.join(".");

      if (newObj[firstKey] === undefined) {
        newObj[firstKey] = {};
      }

      try {
        newObj[firstKey][lastKey] = JSON.parse(input[key]);
      } catch (err) {
        newObj[firstKey][lastKey] = input[key];
      }
    } else {
      newObj[key] = input[key];
    }
  });

  Object.keys(newObj).forEach((key) => {
    if (typeof newObj[key] === "object" && newObj[key] !== null) {
      newObj[key] = createTupleObject(newObj[key]);
    }
  });

  return newObj;
};
export const toFixedWithoutRounding = (value, precision) => {
  if (value === 0 || value === "0") return "0";

  if (value) {
    const [integerPart, decimalPart] = value.toString().split(".");

    if (!decimalPart) {
      return integerPart;
    }

    const truncatedDecimal = decimalPart
      .substring(0, Math.min(precision, 6))
      .padEnd(Math.min(precision, 6));
    return `${integerPart}.${truncatedDecimal}`;
  }

  return "0";
};
export const formatValue = (num) => {
  let result;
  switch (true) {
    case num >= 1e12:
      result = (num / 1e12).toFixed(2) + " T";
      break;
    case num >= 1e9:
      result = (num / 1e9).toFixed(2) + " B";
      break;
    case num >= 1e6:
      result = (num / 1e6).toFixed(2) + " M";
      break;
    case num >= 1e3:
      result = (num / 1e3).toFixed(2) + " K";
      break;
    default:
      result = num?.toString();
      break;
  }
  return result;
};

export const defaultChainOptions = [
  {
    id: "0x1",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: `https://rpc.ankr.com/eth`,
  },
  {
    id: "0xa",
    token: "ETH",
    label: "Optimism",
    rpcUrl: "https://rpc.ankr.com/optimism",
  },
  {
    id: "0x2105",
    token: "ETH",
    label: "Base",
    rpcUrl: "https://mainnet.base.org",
  },
  {
    id: "0xa4b1",
    token: "ETH",
    label: "Arbitrum One",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  {
    id: "0xfa",
    token: "FTM",
    label: "Fantom",
    rpcUrl: "https://rpc.fantom.network",
  },
  {
    id: "0x38",
    token: "BNB",
    label: "Binance Smart Chain",
    rpcUrl: `https://bsc-dataseed.binance.org`,
  },
  {
    id: "0x89",
    token: "MATIC",
    label: "Matic Mainnet",
    rpcUrl: "https://matic-mainnet.chainstacklabs.com",
  },
  {
    id: "0xa86a",
    token: "AVAX",
    label: "Avalanche Mainnet",
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
  },
  {
    id: "0xa4ec",
    token: "CELO",
    label: "Celo Mainnet",
    rpcUrl: "https://rpc.ankr.com/celo",
  },
  {
    id: "0x64",
    token: "XDAI",
    label: "Gnosis Chain",
    rpcUrl: "https://rpc.gnosischain.com/",
  },
  {
    id: "0x44d",
    token: "ETH",
    label: "Polygon zkEVM",
    rpcUrl: "https://zkevm-rpc.com",
  },
  {
    id: "0xe708",
    token: "ETH",
    label: "Linea",
    rpcUrl: "https://linea.drpc.org",
  },
  {
    id: "0x1388",
    token: "MNT",
    label: "Mantle",
    rpcUrl: "https://rpc.mantle.xyz",
  },
];
export const firstCapitalLetter = (input) => {
  if (typeof input === "number") return input;
  if (!input) return "";
  return input?.charAt(0).toUpperCase() + input?.slice(1);
};
