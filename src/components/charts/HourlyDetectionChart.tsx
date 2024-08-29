import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Detection } from "../../types";

interface HourlyDetectionChartProps {
  detections: Detection[];
  onRemove: () => void;
}

const HourlyDetectionChart: React.FC<HourlyDetectionChartProps> = ({
  detections,
  onRemove,
}) => {
  const hourlyDetectionTrend = detections.reduce((acc, detection) => {
    const hour = new Date(detection.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const hourlyChartData = Object.entries(hourlyDetectionTrend).map(
    ([hour, count]) => ({ hour: Number(hour), count })
  );

  return (
    <>
      <h2 className="text-xl font-bold mb-2 text-white flex justify-between">
        Hourly Detection Trend
        <button onClick={onRemove} className="text-red-500">
          &times;
        </button>
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={hourlyChartData}>
          <XAxis dataKey="hour" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default HourlyDetectionChart;
