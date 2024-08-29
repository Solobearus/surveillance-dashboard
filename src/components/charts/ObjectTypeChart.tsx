import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Detection } from "../../types";

interface ObjectTypeChartProps {
  detections: Detection[];
  onRemove: () => void;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ObjectTypeChart: React.FC<ObjectTypeChartProps> = ({
  detections,
  onRemove,
}) => {
  const objectTypeDistribution = detections.reduce((acc, detection) => {
    acc[detection.objectType] = (acc[detection.objectType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const objectTypeChartData = Object.entries(objectTypeDistribution).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <>
      <h2 className="text-xl font-bold mb-2 text-white flex justify-between">
        Object Type Distribution
        <button onClick={onRemove} className="text-red-500">
          &times;
        </button>
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={objectTypeChartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
          >
            {objectTypeChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </>
  );
};

export default ObjectTypeChart;
