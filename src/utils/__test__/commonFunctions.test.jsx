jest.mock("@/constant/constant", () => ({
  BTC_EXPLORER_URL: "https://mempool.space/testnet/",
  TICS_EXPLORER_URL: "https://testnet-v2.qubetics.work/",
  ETH_EXPLORER_URL: "https://etherscan.io/",
  CHAIN_ASSET_MAP: {
    0: "btc",
    9029: "tics",
  },
}));

import {
  formatMillionNumber,
  noExponentsValue,
  formatDecimal,
  formateTotalSupply,
  noExponentialFixed,
  noExponential,
  toFixed,
  randomNoGenerator,
  simplifyNumber,
  capitalizeWord,
  getOffset,
  formatStatus,
  formatText,
  formatToTwoDecimals,
  checkStatus,
  transferType,
  destinationTxn,
  formatToken,
  capitalizeFirstLetter,
  fetchTokenPrices,
  calculateLiquidityUSD,
  getTokenIcon,
  truncateString,
  getTooltipContent,
  getExplorerUrl,
  isValidAlphaNumeric,
} from "../commonFunctions";

describe("commonFunctions", () => {
  describe("formatMillionNumber", () => {
    test("returns 0 for null or undefined", () => {
      expect(formatMillionNumber(null)).toBe("0");
      expect(formatMillionNumber(undefined)).toBe("0");
      expect(formatMillionNumber(NaN)).toBe("0");
    });

    test("formats numbers correctly", () => {
      expect(formatMillionNumber(1000000)).toBe("1 M");
      expect(formatMillionNumber(1500000)).toBe("1.5 M");
      expect(formatMillionNumber(1000000000)).toBe("1 B");
      expect(formatMillionNumber(1000000000000)).toBe("1 T");
      expect(formatMillionNumber(1000)).toBe("1 K");
      expect(formatMillionNumber(500)).toBe("500");
      expect(formatMillionNumber(0.5)).toBe("0.5");
    });
  });

  describe("noExponentsValue", () => {
    test("handles zero", () => {
      expect(noExponentsValue(0)).toBe(0);
    });

    test("handles NaN", () => {
      expect(noExponentsValue(NaN)).toBe(0);
    });

    test("handles small numbers", () => {
      expect(noExponentsValue(0.0000001)).toBe(0);
    });

    test("handles large numbers", () => {
      expect(noExponentsValue(1e20)).toBe(100000000000000000000);
    });
  });

  describe("formatDecimal", () => {
    test("formats decimal numbers", () => {
      expect(formatDecimal("1.23456")).toBe("1.23456");
      expect(formatDecimal(1)).toBe("1");
    });
  });

  describe("formateTotalSupply", () => {
    test("formats total supply", () => {
      expect(formateTotalSupply(1000000)).toBe("1 M");
      expect(formateTotalSupply(1000000000)).toBe("1 B");
      expect(formateTotalSupply(null)).toBe(0);
    });
  });

  describe("noExponentialFixed", () => {
    test("fixes exponential notation", () => {
      expect(noExponentialFixed(0.000001)).toBe("0");
      expect(noExponentialFixed(1.23456)).toBe("1.23456");
    });
  });

  describe("getOffset", () => {
    test("calculates offset correctly", () => {
      expect(getOffset(1, 10)).toBe(0);
      expect(getOffset(2, 10)).toBe(10);
      expect(getOffset(0, 10)).toBe(0);
    });
  });

  describe("formatStatus", () => {
    test("formats status", () => {
      expect(formatStatus("pending")).toBe("Pending");
      expect(formatStatus(null)).toBe("");
    });
  });

  describe("formatText", () => {
    test("formats text", () => {
      expect(formatText("hello_world")).toBe("Hello world");
      expect(formatText(null)).toBe("");
    });
  });

  describe("formatToTwoDecimals", () => {
    test("formats to two decimals", () => {
      expect(formatToTwoDecimals(1.234)).toBe("1.23");
      expect(formatToTwoDecimals(null)).toBe("-");
      expect(formatToTwoDecimals("invalid")).toBe("-");
    });
  });

  describe("checkStatus", () => {
    test("checks status codes", () => {
      expect(checkStatus(0)).toBe("Fail");
      expect(checkStatus(1)).toBe("Confirm");
      expect(checkStatus(2)).toBe("Pending");
      expect(checkStatus(3)).toBe("Pending");
      expect(checkStatus(4)).toBe("-");
    });
  });

  describe("transferType", () => {
    test("determines transfer type", () => {
      expect(transferType(0)).toBe("Contract");
      expect(transferType(1)).toBe("Token Transfer");
      expect(transferType(2)).toBe("-");
    });
  });

  describe("destinationTxn", () => {
    test("gets destination transaction URL", () => {
      expect(destinationTxn("btc", "hash")).toBe(
        "https://mempool.space/testnet/tx/hash"
      );
      expect(destinationTxn("tics", "hash")).toBe(
        "https://testnet-v2.qubetics.work/tx/hash"
      );
      expect(destinationTxn("usdt", "hash")).toBe(
        "https://etherscan.io/tx/hash"
      );
      expect(destinationTxn("unknown", "hash")).toBe(null);
    });
  });

  describe("formatToken", () => {
    test("formats token values", () => {
      expect(formatToken("btc", 100000000)).toBe("1");
      expect(formatToken("tics", 1000000000000000000)).toBe("1");
      expect(formatToken("usdc", 1000000)).toBe("1");
      expect(formatToken("unknown", 100)).toBe("-");
    });
  });

  describe("capitalizeFirstLetter", () => {
    test("capitalizes first letter", () => {
      expect(capitalizeFirstLetter("hello")).toBe("Hello");
      expect(capitalizeFirstLetter(null)).toBe("");
    });
  });

  describe("fetchTokenPrices", () => {
    test("fetches token prices", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ bitcoin: { usd: 50000 }, qubetics: { usd: 1 } }),
        })
      );

      const result = await fetchTokenPrices();
      expect(result).toEqual({ btc: 50000, tics: 1 });
    });
  });

  describe("calculateLiquidityUSD", () => {
    test("calculates liquidity in USD", async () => {
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({ bitcoin: { usd: 50000 }, qubetics: { usd: 1 } }),
        })
      );

      const liquidities = [{ chain_id: 0, total: 2 }];
      const result = await calculateLiquidityUSD(liquidities);
      expect(result).toBe(100000);
    });
  });

  describe("getTokenIcon", () => {
    test("gets token icon", () => {
      expect(getTokenIcon("btc")).toBeDefined();
      expect(getTokenIcon("tics")).toBeDefined();
      expect(getTokenIcon("unknown")).toBe(null);
    });
  });

  describe("truncateString", () => {
    test("truncates string", () => {
      expect(truncateString("verylongstring")).toBe("verylongstring");
      expect(truncateString("verylongstringthatneedstruncation")).toBe(
        "verylongst...truncation"
      );
    });
  });

  describe("getTooltipContent", () => {
    test("gets tooltip content", () => {
      expect(getTooltipContent("BTC", "100000000", "1 BTC")).toBe("1 BTC");
      expect(getTooltipContent("BTC", "100000000", "1 BTC")).toBe("1 BTC");
    });
  });

  describe("getExplorerUrl", () => {
    test("gets explorer URL", () => {
      expect(getExplorerUrl("bitcoin", "hash")).toBe(
        "https://mempool.space/testnet/tx/hash"
      );
      expect(getExplorerUrl("qubetics", "hash")).toBe(
        "https://testnet-v2.qubetics.work/tx/hash"
      );
      expect(getExplorerUrl("unknown", "hash")).toBe("");
    });
  });

  describe("isValidAlphaNumeric", () => {
    test("validates alphanumeric strings", () => {
      expect(isValidAlphaNumeric("abc1234")).toBe(true);
      expect(isValidAlphaNumeric("abc")).toBe(false);
      expect(isValidAlphaNumeric("123")).toBe(false);
      expect(isValidAlphaNumeric("ab")).toBe(false);
    });
  });

  describe("noExponential", () => {
    test("removes exponential notation", () => {
      expect(noExponential(1e-6)).toBe("0.000001");
      expect(noExponential(1000000)).toBe("1000000");
    });
  });

  describe("toFixed", () => {
    test("fixes numbers to specified decimals", () => {
      expect(toFixed(1.23456, 2)).toBe("1.23");
      expect(toFixed(1.999, 2)).toBe("1.99");
    });
  });

  describe("randomNoGenerator", () => {
    test("generates a random number string", () => {
      const result = randomNoGenerator();
      expect(typeof result).toBe("string");
      expect(/^\d\.\d{2}$/.test(result)).toBe(true);
    });
  });

  describe("simplifyNumber", () => {
    test("simplifies numbers", () => {
      expect(simplifyNumber(1e-6)).toBe("0.000001");
      expect(simplifyNumber("invalid")).toBe(
        "Invalid input. Please provide a valid number or numeric string."
      );
    });
  });

  describe("capitalizeWord", () => {
    test("capitalizes words", () => {
      expect(capitalizeWord("hello_world")).toBe("Hello_world");
      expect(capitalizeWord("coin_transfer")).toBe("Coin_Transfer");
    });
  });

  describe("reduceValueLength", () => {
    test("reduces value length", () => {
      const reduceValueLength = require("../commonFunctions").default;
      expect(reduceValueLength("short")).toBe("short");
      expect(reduceValueLength("verylongstring")).toBe("very...ing");
      expect(reduceValueLength("verylongstringthatneedstruncation")).toBe(
        "very...ion"
      );
    });
  });

  describe("additional coverage", () => {
    test("formatMillionNumber negative", () => {
      expect(formatMillionNumber(-1000000)).toBe("-1000000");
    });

    test("formateTotalSupply negative", () => {
      expect(formateTotalSupply(-1000000)).toBe("-1000000");
    });

    test("noExponentsValue negative", () => {
      expect(noExponentsValue(-1e20)).toBe(-100000000000000000000);
    });

    test("formatDecimal more decimals", () => {
      expect(formatDecimal("1.23456789")).toBe("1.23456");
    });

    test("getTooltipContent TICS", () => {
      expect(getTooltipContent("TICS", "1000000000000000000", "1")).toBe(
        "1 TICS"
      );
    });

    test("getExplorerUrl uppercase", () => {
      expect(getExplorerUrl("BITCOIN", "hash")).toBe(
        "https://mempool.space/testnet/tx/hash"
      );
    });
  });
});
