import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Detection } from "../../types";

interface DailyDetectionChartProps {
  detections: Detection[];
  onRemove: () => void;
}

const DailyDetectionChart: React.FC<DailyDetectionChartProps> = ({
  detections,
  onRemove,
}) => {
  const dailyDetectionCount = detections.reduce((acc, detection) => {
    const date = new Date(detection.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dailyChartData = Object.entries(dailyDetectionCount).map(
    ([date, count]) => ({ date, count })
  );

  return (
    <>
      <h2 className="text-xl font-bold mb-2 text-white flex justify-between">
        Daily Detection Count
        <button onClick={onRemove} className="text-red-500">
          &times;
        </button>
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={dailyChartData}>
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default DailyDetectionChart;
