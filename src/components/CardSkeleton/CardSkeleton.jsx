import { Skeleton } from "antd";
import React from "react";
import "./CardSkeleton.scss";
function CardSkeleton() {
  return (
    <div className="tableLoader cardLoader" data-testid="card-skeleton">
      <Skeleton
        active
        paragraph={{
          rows: 1, // Number of paragraph rows
          width: [200], // Custom widths for each row
        }}
        avatar={{
          size: "large", // Avatar size options: large, small, default
          shape: "circle", // Avatar shape: circle or square
        }}
      />
    </div>
  );
}

export default CardSkeleton;
