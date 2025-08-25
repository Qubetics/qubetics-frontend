import { capitalizeWord, noExponentsValue } from "@/utils/commonFunctions";
import { Tooltip } from "antd";

const {
  Routes,
  BlockchainHeaderFunction,
  NodeHeaderFunction,
  contractHeaderFunction,
  toFixedWithoutRounding,
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
export const isEvmChain = () => {
  if (typeof window === "undefined") return false;

  const chainType = localStorage.getItem("chainType");
  return chainType === "EVM Chain";
};
export const formatValueByChain = (value, isEvm) => {
  if (!value) return "-";

  if (isEvm) {
    return (Number(value) / 1e18).toFixed(6) + " TICS";
  }

  return toFixedWithoutRounding(noExponentsValue(Number(value)), 6) + " TICS";
};

export const handleStatus = (result) => {
  const status = result?.toLowerCase();
  if (status === "failed") {
    return <span className="failedtrans">{capitalizeWord(status)}</span>;
  }
  if (["success", "ok"].includes(status)) {
    return <span className="success">{capitalizeWord("success")}</span>;
  }
  return "-";
};

export const formatValue = (
  val,
  withTooltip = false,
  { prefix = "", suffix = "" } = {}
) => {
  const num = Number(val ?? 0);
  const formatted = `${prefix}${num.toLocaleString()}${suffix}`;

  if (withTooltip && num > 0) {
    return (
      <Tooltip placement="top" title={formatted}>
        {formatted}
      </Tooltip>
    );
  }

  return formatted;
};
