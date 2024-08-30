import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Detection } from "../../types";

interface DailyDetectionChartProps {
  detections: Detection[];
}

const DailyDetectionChart: React.FC<DailyDetectionChartProps> = ({
  detections,
}) => {
  const dailyChartData = React.useMemo(() => {
    const dailyDetectionCount = detections.reduce((acc, detection) => {
      const date = new Date(detection.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyDetectionCount).map(([date, count]) => ({
      date,
      count,
    }));
  }, [detections]);

  return (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart
        data={dailyChartData}
        margin={{ top: 10, right: 30, left: -30, bottom: 5 }}
      >
        <XAxis dataKey="date" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip
          formatter={(value, _, props) => [
            `Detections: ${value}`,
            `Date: ${props.payload.date}`,
          ]}
          labelFormatter={() => ""}
        />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DailyDetectionChart;
