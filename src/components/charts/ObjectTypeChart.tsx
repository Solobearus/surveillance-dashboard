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

// Move this outside the component to avoid recreating on each render
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface ObjectTypeChartProps {
  detections: Detection[];
}

const ObjectTypeChart: React.FC<ObjectTypeChartProps> = ({ detections }) => {
  const objectTypeChartData = React.useMemo(() => {
    const objectTypeDistribution = detections.reduce((acc, detection) => {
      acc[detection.objectType] = (acc[detection.objectType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(objectTypeDistribution).map(([name, value]) => ({
      name,
      value,
    }));
  }, [detections]);

  return (
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
          {objectTypeChartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default React.memo(ObjectTypeChart);
