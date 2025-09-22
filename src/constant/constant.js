"use client";

import { trackEvent } from "@/utils/eventTrack";
import Link from "next/link";

export const currencyName = "TICS";
export const EXPLORER_API_URL = process.env.NEXT_PUBLIC_EXPLORER_API_URL;
export const EXPLORER_CONTRACT_VERIFY_URL =
  process.env.NEXT_PUBLIC_CONTRACT_VERIFY_URL;
export const WEB_PROVIDER_URL = process.env.NEXT_PUBLIC_METAMASK_NETWROK_URL;
export const NATIVE_EXPLORER_API_URL = `${process.env.NEXT_PUBLIC_NATIVE_EXPLORER_API_URL}qubetics/`;
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
export const BUG_REPORT_API = process.env.NEXT_PUBLIC_BUG_REPORT_API_URL;
export const G_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_G_TAG_MANAGER_ID;
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
export const DVPN_TRANSACTION_TYPE = {
  START_SUBSCRIPTION: "START_SUBSCRIPTION",
  END_SUBSCRIPTION: "END_SUBSCRIPTION",
  START_REQUEST: "START_REQUEST",
  END_REQUEST: "END_REQUEST",
};

export const Messages = {
  //Metamask
  Install_Metamask: `Metamask is not installed. Please install Metamask. Or refresh the browser`,
  Retrive_Meta_Account: `Cannot retrieve any account. Please refresh the browser`,
  Same_Network: `You are already on the ${EXPLORER_CHAIN_NAME} network.`,
  Successfully_Switched: `You have successfully switched to ${EXPLORER_CHAIN_NAME} network.`,
  Network_Added: `You have successfully switched to ${EXPLORER_CHAIN_NAME} network.`,
  Network_Add_Error: `Error adding ${EXPLORER_CHAIN_NAME} network: `,
  isTrust: "Kindly use Metamask as your default wallet",

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
  SYNC: "/sync",
  NOT_FOUND: "/notfound",
  CONTRACTS: "/contract",
  CONTRACT_DETAIL: "/contract/",
  CONTRACT_VERIFICATOIN: "/contract/verify",
  TOKEN: "/token",
  VALIDATORS: "/validators",
  STATS: "/charts",
  TOKEN_TXNS: "/tokentxns",
  TOKEN_ICON: "/tokenicon",
  DVPNNODES: "/dVPNNodes",
  ACCOUNTS: "/accounts",
};
export const graphUrl = {
  coin_transfer: "explorer/graph/coin-transfer",
  total_account: "explorer/graph/account",
  token_price: "explorer/graph/coin-price",
  txn_fee: "explorer/graph/tx-fee",
};
export const verifyContractConstant = {
  INFO: "A simple and structured interface for verifying smart contracts that fit in a single file",
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
    "Source code verification provides transparency for users interacting with smart contracts. By uploading the source code, TICSscan will match the compiled code with that on the blockchain. Just like contracts, a 'smart contract' should provide end users with more information on what they are 'digitally signing' for and give users an opportunity to audit the code to independently verify that it actually does what it is supposed to do.",
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
  total_Dvpn_Provider:
    "The total count of all node providers participating in the dVPN network.",
  active_provider:
    "Number of providers currently online and serving users in real time",
  total_dvpn_user:
    "The overall number of unique users who have ever connected to the dVPN",
  active_user: "Users who are currently connected and using the dVPN service.",
  total_Dvpn_Transactions:
    "The cumulative number of transactions processed through the dVPN network.",
  Current_Session_Count:
    "Total sessions started by users within the last 24 hours.",
  block_Height:
    "The number of blocks added to the blockchain since its inception, indicating the blockchain’s current length.",
  bonded_Coins: `The total amount of  ${currencyName} token bonded or staked in the network to secure it and earn rewards."`,
  total_Nodes: "The total number of nodes connected to the Qubetics network.",
  last_Block: "The most recent block added to the blockchain.",
  TPB: "Transactions per block. Display the average number of transactions recorded in a block during the last six seconds.",
  Countries: "The number of countries from which nodes are connected.",
  finalized_Block:
    "A block confirmed by the network as permanent and immutable, ensuring it cannot be altered or reversed.",
};
export function BlockchainHeaderFunction(currentPath) {
  const onLinkClick = (category, label) => {
    trackEvent({
      action: "link_click",
      category: category,
      label: label,
    });
  };
  const blockchainHeader = [
    {
      key: "1",
      value: "Blocks",
      className: currentPath === Routes.BLOCKS ? "activeOptions" : "",
      label: (
        <Link onClick={() => onLinkClick("Nav_Block", "Blocks")} href="/blocks">
          Blocks
        </Link>
      ),
    },
    {
      key: "2",
      value: "Transactions",
      className: currentPath.startsWith(Routes.TRANSACTIONS)
        ? "activeOptions"
        : "",
      label: (
        <Link
          onClick={() => onLinkClick("NavTransactions", "Transactions")}
          href="/tx"
        >
          Transactions
        </Link>
      ),
    },
  ];
  return blockchainHeader;
}
//Node header Function
export function NodeHeaderFunction(currentPath, onClick) {
  const NodeHeader = [
    {
      key: "1",
      value: "Node",
      className: currentPath === Routes.NODES ? "activeOptions" : "",
      label: (
        <Link onClick={() => onClick("Nav_Nodes", "Nodes")} href="/nodes">
          Nodes
        </Link>
      ),
    },
    {
      key: "2",
      value: "Sync",
      className: currentPath === Routes.SYNC ? "activeOptions" : "",
      label: (
        <Link onClick={() => onClick("Nav_Sync", "Sync")} href="/sync">
          Sync
        </Link>
      ),
    },
  ];
  return NodeHeader;
}

export function DvpnNodeHeaderFunction(currentPath, onClick) {
  const NodeHeader = [
    {
      key: "1",
      value: "Node",
      className: currentPath.startsWith(Routes.DVPNNODES)
        ? "activeOptions"
        : "",
      label: (
        <Link
          onClick={() => onClick("Nav_Nodes", "dVPNNodes")}
          href="/dVPNNodes"
        >
          Nodes
        </Link>
      ),
    },
    {
      key: "2",
      value: "Accounts",
      className:
        currentPath === Routes.ACCOUNTS ||
        currentPath.startsWith(Routes.Tx_ADDRESS)
          ? "activeOptions"
          : "",
      label: (
        <Link
          onClick={() => onClick("Nav_Accounts", "Accounts")}
          href="/accounts"
        >
          Accounts
        </Link>
      ),
    },
  ];
  return NodeHeader;
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
        <Link
          onClick={() => onClick("Nav_Contract", "All Contracts")}
          href="/contract"
        >
          All Contracts
        </Link>
      ),
    },

    {
      key: "2",
      value: "Verifiedcontract",
      className: currentPath === Routes.TOKEN_ICON ? "activeOptions" : "",
      label: (
        <Link
          onClick={() => onClick("Nav_TokenIcon", "Token Icon")}
          href="/tokenicon"
        >
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
        <Link
          onClick={() => onClick("Nav_VerifyContract", "Verify Contract")}
          href="/contract/verify"
        >
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
    case num >= 1e24:
      result = (num / 1e24).toFixed(2) + " S"; // Septillion (1e24)
      break;
    case num >= 1e18:
      result = (num / 1e18).toFixed(2) + " Q";
      break;
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

export const KeyNotes = [
  {
    id: 1,
    title:
      "Participants must agree to the terms and conditions of the Testnet Rewards Program when submitting.",
  },
  {
    id: 2,
    title:
      "Submissions that do not follow the guidelines will be marked as invalid and will not qualify for rewards.",
  },
  {
    id: 3,
    title: "A confirmation email will be sent upon successful submission.",
  },
];

export const guidelinesList = [
  {
    id: 1,
    title: "Validation",
    description:
      "Submissions will be reviewed for completeness, accuracy, and adherence to guidelines.",
  },
  {
    id: 2,
    title: "Testing",
    description:
      "The reported bug will be tested and verified by the development team.",
  },
  {
    id: 3,
    title: "Reward Allocation",
    description:
      "Eligible contributions will be categorized and rewarded based on complexity and impact as per the Testnet Rewards Program.",
  },
];

const bugs = [
  { id: 1, type: "Minor Bug" },
  { id: 2, type: "Major Bug" },
  { id: 3, type: "UI/UX Improvement" },
  { id: 4, type: "Feature Suggestion" },
];

export const guidelinesData = [
  {
    id: 1,
    title: "Complete All Mandatory Fields",
    description:
      "All required fields in the form must be completed accurately, including Name, Email, and Application Tested.",
  },
  {
    id: 2,
    title: "Provide a Clear Bug Description",
    description:
      "Clearly describe the bug or feedback. Include details such as steps to reproduce the bug, expected behavior, and actual behavior. Avoid vague or incomplete descriptions.",
  },
  {
    id: 3,
    title: "Mandatory Attachments",
    description: (
      <p>
        Every bug submission must include at least one supporting file
        (screenshot or screen-recorded video) as evidence of the reported issue.{" "}
        <br /> <br />
        Ensure the uploaded file is clear, relevant, and demonstrates the bug.
      </p>
    ),
  },
  {
    id: 4,
    title: "Categorize the Bug Properly",
    description: (
      <div className="bugCategorize">
        <p>Select the appropriate category for your submission</p>
        <div className="bugCategorize_top">
          {bugs.map((bug) => (
            <div key={bug.id} className="bugCategorize_inner">
              <div></div>
              <h6>{bug.type}</h6>
            </div>
          ))}
        </div>
        <p>
          Incorrect categorization may delay the review process or affect reward
          eligibility.
        </p>
      </div>
    ),
  },
  {
    id: 5,
    title: "Detail the Application Tested",
    description:
      "Specify the application where the bug or issue was encountered (e.g., TICSScan, Qubetics Delegator & Validator Interfaces, Qubetics IDE, or QubeQode).",
  },
  {
    id: 6,
    title: "Severity Rating",
    description:
      "Indicate the severity level (Low, Medium, or High) based on the impact of the bug on the application’s functionality.",
  },
  {
    id: 7,
    title: "Respect Submission Deadlines",
    description:
      "Submissions must be made within the timelines outlined in the Testnet Rewards Program. Late entries will not be accepted.",
  },
  {
    id: 8,
    title: "Avoid Duplicate Submissions",
    description:
      "Check the known issues list before submitting to avoid reporting already documented bugs. Duplicate submissions will not be rewarded.",
  },
  {
    id: 8,
    title: "No Plagiarized or False Submissions",
    description:
      "Ensure the bug is original and verified. Submissions found to be false or copied from others will be disqualified.",
  },
  {
    id: 8,
    title: "Maintain Professionalism",
    description:
      "Feedback and suggestions should be constructive, actionable, and respectful.",
  },
];

export const validateInput = (value, maxLength) => {
  return value
    .replace(/^\s+/g, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, maxLength);
};

export const handleValidValue = (value) => validateInput(value, 20);
export const handleValidEmail = (value) => validateInput(value, 50);
export const WalletValidValue = (value) => validateInput(value, 42);
export const descriptionValidValue = (value) => validateInput(value, 500);

export const DVPN_TYPE = {
  START_SUBSCRIPTION: "/qubetics.subscription.v3.MsgStartSubscriptionRequest",
  END_SUBSCRIPTION: "/qubetics.subscription.v3.MsgCancelSubscriptionRequest",
  START_SESSION: "/qubetics.subscription.v3.MsgStartSessionRequest",
  END_SESSION: "/qubetics.session.v3.MsgCancelSessionRequest",
};
