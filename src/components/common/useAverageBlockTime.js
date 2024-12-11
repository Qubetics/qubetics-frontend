import { useEffect, useState } from "react";
import { useLatestData } from "../contexts/latest_data";

const useAverageBlockTime = () => {
  const webSocketData = useLatestData();
  const [blocksData, setBlockData] = useState([]);
  const [diffs, updateDiffs] = useState([]);
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [block, setBlock] = useState(null);

  useEffect(() => {
    setRecentBlocks(blocksData);
  }, [blocksData]);

  useEffect(() => {
    if (webSocketData?.blocks?.blocknumber) {
      let index = recentBlocks?.findIndex(
        (item) =>
          Number(item?.block_number) ===
          Number(webSocketData?.blocks?.blocknumber)
      );
      if (index === -1) {
        setRecentBlocks([
          {
            blocknumber: webSocketData?.blocks?.blocknumber,
            createdAt: new Date(),
            blockhash: webSocketData?.blocks?.blockhash,
            timestamp: Math.floor(Date.now() / 1000),
          },
          ...recentBlocks,
        ]);
      }
    }
  }, [webSocketData?.blocks]);

  const getDiff = (start, end) => {
    if (!start || !end) {
      return "";
    }
    return (end - start) / 1000;
  };

  useEffect(() => {
    let controller = new AbortController();
    let mounted = false;
    if (
      Number(webSocketData?.blocks?.timestamp) !== undefined &&
      Number(block?.timestamp) !== undefined
    ) {
      const newDiff =
        diffs &&
        (diffs.length > 2
          ? JSON.parse(JSON.stringify([...diffs.slice(0, 2)]))
          : JSON.parse(JSON.stringify(diffs)));
      updateDiffs(
        [
          ...newDiff,
          getDiff(
            new Date(block?.timestamp).getTime(),
            new Date(webSocketData?.blocks?.timestamp).getTime()
          ),
        ].filter(Boolean)
      );
      setBlock(webSocketData?.blocks);

      mounted = true;
      return () => controller?.abort();
    }
  }, [webSocketData?.blocks?.blocknumber]);

  return { diffs, setBlockData };
};

export default useAverageBlockTime;
