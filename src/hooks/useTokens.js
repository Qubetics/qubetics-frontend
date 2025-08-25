import { useState, useEffect, useCallback } from "react";

export function useTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextParams, setNextParams] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTokens = useCallback(async (params = null, reset = false) => {
    setLoading(true);
    setError(null);

    try {
      let url = "https://v2.ticsscan.com/api/v2/tokens";

      if (params) {
        const query = new URLSearchParams(
          Object.entries(params).reduce((acc, [key, val]) => {
            acc[key] = val !== null ? String(val) : "";
            return acc;
          }, {})
        );
        url += `?${query.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();

      setTokens((prev) =>
        reset ? data.items || [] : [...prev, ...(data.items || [])]
      );
      setNextParams(data.next_page_params || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTokens(null, true); // initial load
  }, [fetchTokens]);

  const fetchNextPage = () => {
    if (nextParams) {
      setCurrentPage((prev) => prev + 1);
      fetchTokens(nextParams);
    }
  };

  const fetchFirstPage = () => {
    setCurrentPage(1);
    setTokens([]); // reset tokens
    fetchTokens(null, true); // reload first page
  };

  return {
    tokens,
    loading,
    error,
    fetchNextPage,
    fetchFirstPage,
    currentPage,
    hasMore: !!nextParams,
  };
}
