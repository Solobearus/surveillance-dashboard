import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Detection } from "../../types";

interface CameraActivityChartProps {
  detections: Detection[];
}

const CameraActivityChart: React.FC<CameraActivityChartProps> = ({
  detections,
}) => {
  const cameraChartData = useMemo(() => {
    const cameraActivity = detections.reduce((acc, detection) => {
      acc[detection.cameraId] = (acc[detection.cameraId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(cameraActivity).map(([cameraId, count]) => ({
      cameraId,
      count,
    }));
  }, [detections]);

  return (
    <ResponsiveContainer width="100%" height="85%">
      <BarChart
        data={cameraChartData}
        margin={{ top: 10, right: 30, left: -30, bottom: 5 }}
      >
        <XAxis dataKey="cameraId" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip
          formatter={(value, _, props) => [
            `Detections: ${value}`,
            `Camera: ${props.payload.cameraId}`,
          ]}
          labelFormatter={() => ""}
        />
        <Bar dataKey="count" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CameraActivityChart;
