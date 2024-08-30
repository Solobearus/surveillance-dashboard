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
  onRemove: () => void;
}

const CameraActivityChart: React.FC<CameraActivityChartProps> = ({
  detections,
  onRemove,
}) => {
  const cameraActivity = detections.reduce((acc, detection) => {
    acc[detection.cameraId] = (acc[detection.cameraId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cameraChartData = Object.entries(cameraActivity).map(
    ([cameraId, count]) => ({ cameraId, count })
  );

  return (
    <>
      <h2 className="text-xl font-bold mb-2 text-white flex justify-between draggable-handle">
        Camera Activity
        <button onClick={onRemove} className="text-red-500">
          &times;
        </button>
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={cameraChartData}>
          <XAxis dataKey="cameraId" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default CameraActivityChart;
