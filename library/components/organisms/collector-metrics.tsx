import React from "react";
import MetricBox, { Metric } from "../molecules/metric-box";

const CollectorMetrics = ({ metrics }: { metrics: Metric[] }) => {
  return (
    <div className="flex flex-nowrap overflow-x-auto">
      {metrics.map((metric, index) => (
        <MetricBox key={index} {...metric} />
      ))}
    </div>
  );
};

export default CollectorMetrics;
