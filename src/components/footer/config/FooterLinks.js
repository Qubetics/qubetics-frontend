import {
  CmcIcon,
  Discord,
  Instagram,
  Telegram,
  TikTok,
  Twitter,
  YoutubeIcon,
} from "../../../../public/SvgIcons";

export const footerLinks = [
  {
    title: "Quick Links",
    items: [
      {
        label: "Tokens",
        href: "/token",
      },
      { label: "Blockchain", href: "/blocks" },
      { label: "Validators", href: "/validators" },
      { label: "Nodes", href: "/nodes" },
      { label: "Chain Abstraction", href: "/chain-abstraction" },
      { label: "Solver Listing", href: "/solver-listing" },
    ],
  },
  {
    title: "About Us",
    items: [
      {
        label: "Privacy Policy",
        href: "https://www.qubetics.com/privacy-policy",
        external: true,
      },
      {
        label: "Terms of Service",
        href: "https://www.qubetics.com/terms-of-use",
        external: true,
      },
    ],
  },
  {
    title: "Product & Services",
    items: [
      {
        label: "Qubetics Validator App",
        href: "https://validator-testnet.qubetics.work/",
        external: true,
      },
      {
        label: "Qubetics Delegator App",
        href: "https://delegator-testnet.qubetics.work/",
        external: true,
      },
      { label: "Qubetics DEX", disabled: true },
      { label: "Qubetics App", disabled: true },
      {
        label: "Qubetics IDE",
        href: "https://ide.qubetics.com",
        external: true,
      },
      {
        label: "QubeQode",
        href: "https://qubeqode.qubetics.com",
        external: true,
      },
      {
        label: "Node Operator",
        href: "http://prod-dvpn-node-operator.qubetics.work",
      },

      {
        label: "Node Provider",
        href: "http://prod-dvpn-service-provider.qubetics.work",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        label: "Official Web",
        href: "https://www.qubetics.com/",
        external: true,
      },
      {
        label: "Qubetics Network Documentation",
        href: "https://docs.qubetics.com/",
        external: true,
      },
      {
        label: "Qubetics Documentation",
        href: "https://qubetics.gitbook.io/qubetics-docs",
        external: true,
      },
      { label: "GitHub", href: "https://github.com/Qubetics", external: true },
    ],
  },
];

export const SocialMediaLinks = [
  {
    label: "Twitter",
    href: "https://x.com/qubetics?mx=2",
    external: true,
    icon: <Twitter />,
  },
  {
    label: "Telegram",
    href: "https://t.me/qubetics",
    external: true,
    icon: <Telegram />,
  },
  {
    label: "Discord",
    href: "https://discord.com/invite/KHfSNbzdSE",
    external: true,
    icon: <Discord />,
  },
  {
    label: "Youtube",
    href: "https://www.youtube.com/@Qubetics",
    external: true,
    icon: <YoutubeIcon />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/qubetics",
    external: true,
    icon: <Instagram />,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@qubetics",
    external: true,
    icon: <TikTok />,
  },
  {
    label: "CMC",
    href: "https://coinmarketcap.com/currencies/qubetics/",
    external: true,
    icon: <CmcIcon />,
  },
];
