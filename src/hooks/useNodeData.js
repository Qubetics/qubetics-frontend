import { useLatestData } from "@/components/contexts/latest_data";
import { randomNoGenerator } from "@/utils/commonFunctions";

export const useNodeData = () => {
  const webSocketData = useLatestData();
  const blockHeight = webSocketData?.blocks?.blocknumber || "";
  const nodePerformanceData = [
    { value: blockHeight, label: "Block Height" },
    { value: "15", label: "Total Nodes" },
    { value: randomNoGenerator() + "s", label: "Last Blocks" },
    { value: "6", label: "Countries" },
  ];

  return { nodePerformanceData };
};
