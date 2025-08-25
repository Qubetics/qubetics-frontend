import { NEW_EXPLORER_STATS_V2_URL } from "@/constant/constant";
import { useState, useEffect, useCallback } from "react";

export function useTransactionStats({ isEvm }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${NEW_EXPLORER_STATS_V2_URL}/pages/transactions`
      );
      if (!res.ok) throw new Error("Failed to fetch transaction stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isEvm) return;
    fetchStats();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
