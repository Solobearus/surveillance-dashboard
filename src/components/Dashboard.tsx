import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetections, fetchCameras } from "../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Detection, Camera } from "../types";

const Dashboard: React.FC = () => {
  const { data: detections, isLoading: detectionsLoading } = useQuery<
    Detection[]
  >({
    queryKey: ["detections"],
    queryFn: fetchDetections,
  });

  const { data: cameras, isLoading: camerasLoading } = useQuery<Camera[]>({
    queryKey: ["cameras"],
    queryFn: fetchCameras,
  });

  if (detectionsLoading || camerasLoading) return <div>Loading...</div>;

  const dailyDetectionCount = detections?.reduce((acc, detection) => {
    const date = new Date(detection.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(dailyDetectionCount || {}).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  const objectTypeDistribution = detections?.reduce((acc, detection) => {
    acc[detection.objectType] = (acc[detection.objectType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(objectTypeDistribution || {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

  return (
    <div>
      <h1>Surveillance Dashboard</h1>

      <h2>Detections Table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Timestamp</th>
            <th>Camera</th>
            <th>Object Type</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          {detections?.map((detection) => (
            <tr key={detection.id}>
              <td>{detection.id}</td>
              <td>{new Date(detection.timestamp).toLocaleString()}</td>
              <td>{detection.cameraId}</td>
              <td>{detection.objectType}</td>
              <td>{detection.confidenceScore.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Daily Detection Count</h2>
      <BarChart width={600} height={300} data={chartData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>

      <h2>Object Type Distribution</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={pieChartData}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default Dashboard;
