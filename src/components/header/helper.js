const {
  Routes,
  BlockchainHeaderFunction,
  NodeHeaderFunction,
  contractHeaderFunction,
  DvpnNodeHeaderFunction,
  DVPN_TYPE,
  EXPLORER_NETWORK_NAME,
} = require("@/constant/constant");

export const navItems = (isEVM) => {
  
  return [
    {
      type: "link",
      label: "Dashboard",
      href: Routes.DASHBOARD,
      matchRoutes: [Routes.DASHBOARD],
      eventName: "Dashboard_link",
    },
    {
      type: "select",
      label: "Blockchain",
      matchRoutes: [Routes.BLOCKS, Routes.TRANSACTIONS],
      optionsFn: BlockchainHeaderFunction,
    },
    {
      type: "link",
      label: "Tokens",
      href: Routes.TOKEN,
      matchRoutes: [Routes.TOKEN],
      eventName: "Tokens_link",
      showIfEVM: isEVM,
    },
    {
      type: "link",
      label: "Validators",
      href: Routes.VALIDATORS,
      matchRoutes: [Routes.VALIDATORS],
      eventName: "Validators_link",
    },
    {
      type: "select",
      label: "Nodes",
      matchRoutes: [Routes.NODES, Routes.SYNC],
      optionsFn: NodeHeaderFunction,
    },
    {
      type: "select",
      label: "dVPN",
      matchRoutes: [Routes.DVPNNODES, Routes.ACCOUNTS, Routes.Tx_ADDRESS],
      optionsFn: DvpnNodeHeaderFunction,
      showIfNative: !isEVM,
    },
    {
      type: "select",
      label: "Contracts",
      matchRoutes: [
        Routes.CONTRACTS,
        Routes.CONTRACT_VERIFICATOIN,
        Routes.TOKEN_ICON,
      ],
      optionsFn: contractHeaderFunction,
      showIfEVM: isEVM,
    },
    {
      type: "link",
      label: "Faucet",
      href: Routes.FAUCET,
      matchRoutes: [Routes.FAUCET],
      showIfEVM: isEVM,
      showIfFaucet: EXPLORER_NETWORK_NAME.toLowerCase() === "testnet" ?? false,
    },
  ];
};

export const getDVPNTypeKey = (type) => {
  return Object.keys(DVPN_TYPE).find((key) => DVPN_TYPE[key] === type);
};

export const formatDateTime = (timestamp) => {
  if (!timestamp) return "-";

  const now = new Date();

  const checkedInDate = new Date(timestamp);

  // Calculate the difference in milliseconds
  const diffMs = now - checkedInDate;

  // Convert to different time units
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  // Return appropriate format based on time difference
  if (diffSeconds < 60) {
    return diffSeconds === 1 ? "1 second ago" : `${diffSeconds} seconds ago`;
  } else if (diffMinutes < 60) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  } else if (diffDays < 30) {
    return diffWeeks === 1 ? "1 week ago" : `${diffWeeks} weeks ago`;
  } else if (diffDays < 365) {
    return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  } else {
    return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
  }
};
