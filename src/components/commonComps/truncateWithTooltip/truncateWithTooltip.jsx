import { truncateString } from "@/utils/commonFunctions";
import { Tooltip } from "antd";

export const truncateWithTooltip = (str, maxLength = 12) => {
  if (!str) return "";

  // Check screen width
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;

  // For small screens, truncate aggressively
  const shouldTruncate = screenWidth < 1024 && str.length > maxLength;

  if (shouldTruncate) {
    return (
      <Tooltip title={str}>
        <span>{truncateString(str, 15, 15)}</span>
      </Tooltip>
    );
  }

  // Show full value if not truncated
  return <span>{str}</span>;
};
