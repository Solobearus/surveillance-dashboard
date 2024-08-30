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
  // Get the current date and round down to the nearest full hour
  const now = new Date();
  now.setMinutes(0, 0, 0); // Round down to the nearest full hour
  const currentHour = now.getHours();

  // Create an array for the last 24 full hours
  const last24Hours = Array.from({ length: 24 }, (_, i) => {
    const date = new Date(now);
    date.setHours(currentHour - i);
    return {
      hour: date.getHours(),
      fullHour: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      count: 0,
    };
  }).reverse(); // Reverse so that the latest hour is on the right

  // Map detections to the last 24 full hours
  const hourlyDetectionTrend = detections.reduce((acc, detection) => {
    const detectionDate = new Date(detection.timestamp);
    detectionDate.setMinutes(0, 0, 0); // Round down to the nearest full hour
    const detectionHour = detectionDate.getHours();
    const hourData = acc.find((entry) => entry.hour === detectionHour);
    if (hourData) {
      hourData.count += 1;
    }
    return acc;
  }, last24Hours);

  return (
    <>
      <h2 className="text-xl font-bold mb-2 text-white flex justify-between draggable-handle">
        Hourly Detection Trend
        <button onClick={onRemove} className="text-red-500">
          &times;
        </button>
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={hourlyDetectionTrend}
          margin={{ top: 10, right: 30, left: -30, bottom: 5 }}
        >
          <XAxis dataKey="fullHour" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip
            formatter={(value, name, props) => [
              `Detections: ${value}`,
              `Hour: ${props.payload.fullHour}`,
            ]}
            labelFormatter={() => ""}
          />
          <Line type="monotone" dataKey="count" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default HourlyDetectionChart;
