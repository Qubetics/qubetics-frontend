import { useLatestData } from "@/components/contexts/latest_data";
import { useEffect, useRef, useState } from "react";

const useBlockData = () => {
  const [lastBlock, setLastBlock] = useState(6);
  const webSocket = useLatestData();
  const prevBlockRef = useRef(null);
  const blockHeight = webSocket?.blocks?.blocknumber || "";

  useEffect(() => {
    const newBlock = webSocket?.blocks;
    if (!newBlock) return;
    const prevBlock = prevBlockRef.current;
   
    if (prevBlock?.blocknumber === newBlock?.blocknumber) return;

    if (prevBlock?.timestamp) {
      const t1 = new Date(newBlock?.timestamp).getTime();
      const t2 = new Date(prevBlock?.timestamp).getTime();
      const difference = Math.abs((t1 - t2) / 1000);
      setLastBlock(difference);
    }
    prevBlockRef.current = newBlock;
  }, [webSocket]);
  return {
    lastBlock,
    blockHeight,
    webSocket,
  };
};
export default useBlockData;
