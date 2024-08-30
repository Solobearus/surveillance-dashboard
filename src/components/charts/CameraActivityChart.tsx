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

interface CameraActivityChartProps {
  detections: Detection[];
}

const CameraActivityChart: React.FC<CameraActivityChartProps> = ({
  detections,
}) => {
  const cameraActivity = detections.reduce((acc, detection) => {
    acc[detection.cameraId] = (acc[detection.cameraId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cameraChartData = Object.entries(cameraActivity).map(
    ([cameraId, count]) => ({ cameraId, count })
  );

  return (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart
        data={cameraChartData}
        margin={{ top: 10, right: 30, left: -30, bottom: 5 }}
      >
        <XAxis dataKey="cameraId" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip
          formatter={(value, name, props) => [
            `Detections: ${value}`,
            `Camera: ${props.payload.cameraId}`,
          ]}
          labelFormatter={() => ""} // Optionally suppress the default label (date) display
        />
        <Bar dataKey="count" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CameraActivityChart;
