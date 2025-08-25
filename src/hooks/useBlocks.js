import { useState, useEffect, useCallback } from "react";

export function useBlocks(type = "block", setLoading, setBlocksData, isEvm) {
  const [error, setError] = useState(null);
  const [nextParams, setNextParams] = useState(null);
  const [currentPage, setPage] = useState(1); // track current page

  const fetchBlocks = useCallback(
    async (params = null, reset = false) => {
      setLoading(true);
      setError(null);

      try {
        let url = `https://v2.ticsscan.com/api/v2/blocks?type=${type}`;

        if (params) {
          const query = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, val]) => {
              acc[key] = val !== null ? String(val) : "";
              return acc;
            }, {})
          );
          url += `&${query.toString()}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();

        setBlocksData((prev) =>
          reset ? data.items || [] : [...prev, ...(data.items || [])]
        );
        setNextParams(data.next_page_params || null);

        if (reset) {
          setPage(1); // reset to first page
        } else {
          setPage((prev) => prev + 1); // increment page
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [type, setBlocksData, setLoading]
  );

  // fetch first page on mount & when type changes
  useEffect(() => {
    if (!isEvm) return;
    setBlocksData([]);
    setNextParams(null);
    setPage(1);
    fetchBlocks(null, true);
  }, [fetchBlocks, setBlocksData]);

  const fetchFirstPage = () => {
    if (!isEvm) return;
    setBlocksData([]);
    setNextParams(null);
    setPage(1);
    fetchBlocks(null, true);
  };

  const fetchNextPage = () => {
    if (!isEvm) return;
    if (nextParams) {
      fetchBlocks(nextParams);
    }
  };

  return {
    error,
    fetchFirstPage,
    fetchNextPage,
    hasMore: !!nextParams,
    currentPage, // expose page
  };
}
