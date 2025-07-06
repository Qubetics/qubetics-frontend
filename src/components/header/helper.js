const {
  Routes,
  BlockchainHeaderFunction,
  NodeHeaderFunction,
  contractHeaderFunction,
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
    // {
    //   type: "link",
    //   label: "Faucet",
    //   href: Routes.FAUCET,
    //   matchRoutes: [Routes.FAUCET],
    //   showIfEVM: isEVM,
    //   showIfFaucet: false,
    // },
  ];
};
