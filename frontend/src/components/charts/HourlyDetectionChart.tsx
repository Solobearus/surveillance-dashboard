import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Detection } from "../../types";

interface HourlyDetectionChartProps {
  detections: Detection[];
}

const HourlyDetectionChart: React.FC<HourlyDetectionChartProps> = ({
  detections,
}) => {
  const hourlyDetectionTrend = useMemo(() => {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    const currentHour = now.getHours();

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
    }).reverse();

    return detections.reduce((acc, detection) => {
      const detectionHour = new Date(detection.timestamp).getHours();
      const hourData = acc.find((entry) => entry.hour === detectionHour);
      if (hourData) {
        hourData.count += 1;
      }
      return acc;
    }, last24Hours);
  }, [detections]);

  return (
    <ResponsiveContainer width="100%" height="85%">
      <LineChart
        data={hourlyDetectionTrend}
        margin={{ top: 10, right: 30, left: -30, bottom: 5 }}
      >
        <XAxis dataKey="fullHour" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip
          formatter={(value: number) => [`Detections: ${value}`]}
          labelFormatter={(label: string) => `Hour: ${label}`}
        />
        <Line type="monotone" dataKey="count" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HourlyDetectionChart;
