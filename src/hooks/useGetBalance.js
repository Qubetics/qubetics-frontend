import getQubeticsPrice from "@/services/getQubeticsPrice";
import { ethers, JsonRpcProvider } from "ethers";
import { useCallback, useEffect, useState } from "react";

const useEthereumBalance = (address, rpcUrl) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usdPrice, setUsdPrice] = useState("");

  const fetchBalance = useCallback(async () => {
    if (!address || !rpcUrl) return;
    setLoading(true);

    try {
      const provider = new JsonRpcProvider(rpcUrl);

      const [balanceWei, response] = await Promise.all([
        provider.getBalance(address),
        getQubeticsPrice(),
      ]);

      const balanceEther = ethers.formatEther(balanceWei);
      setBalance(balanceEther);

      const price = response?.data || 0;
      const calculatedUsd = Number(price) * Number(balanceEther);
      setUsdPrice(calculatedUsd.toFixed(4)); // Rounded to 4 decimals
    } catch (err) {
      console.error("Error fetching balance or price:", err);
      setError(err);
      setBalance(null);
      setUsdPrice("");
    } finally {
      setLoading(false);
    }
  }, [address, rpcUrl]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, fetchBalance, usdPrice };
};

export default useEthereumBalance;
