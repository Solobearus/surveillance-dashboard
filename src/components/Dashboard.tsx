// Dashboard.tsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetections, fetchCameras } from "../api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Detection, Camera } from "../types";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DetectionTable from "./DetectionTable";

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard: React.FC = () => {
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "table", x: 0, y: 0, w: 6, h: 2 },
      { i: "dailyCount", x: 6, y: 0, w: 3, h: 1 },
      { i: "hourlyTrend", x: 9, y: 0, w: 3, h: 1 },
      { i: "cameraActivity", x: 6, y: 1, w: 3, h: 1 },
      { i: "objectType", x: 9, y: 1, w: 3, h: 1 },
    ],
  });

  const [activeCharts, setActiveCharts] = useState([
    "table",
    "dailyCount",
    "hourlyTrend",
    "cameraActivity",
    "objectType",
  ]);

  const { data: detections, isLoading: detectionsLoading } = useQuery({
    queryKey: ["detections"],
    queryFn: fetchDetections,
  });

  const { data: cameras, isLoading: camerasLoading } = useQuery({
    queryKey: ["cameras"],
    queryFn: fetchCameras,
  });

  if (detectionsLoading || camerasLoading)
    return <div className="text-white">Loading...</div>;

  const dailyDetectionCount = detections?.reduce((acc, detection) => {
    const date = new Date(detection.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dailyChartData = Object.entries(dailyDetectionCount || {}).map(
    ([date, count]) => ({ date, count })
  );

  const hourlyDetectionTrend = detections?.reduce((acc, detection) => {
    const hour = new Date(detection.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const hourlyChartData = Object.entries(hourlyDetectionTrend || {}).map(
    ([hour, count]) => ({ hour: Number(hour), count })
  );

  const cameraActivity = detections?.reduce((acc, detection) => {
    acc[detection.cameraId] = (acc[detection.cameraId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cameraChartData = Object.entries(cameraActivity || {}).map(
    ([cameraId, count]) => ({ cameraId, count })
  );

  const objectTypeDistribution = detections?.reduce((acc, detection) => {
    acc[detection.objectType] = (acc[detection.objectType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const objectTypeChartData = Object.entries(objectTypeDistribution || {}).map(
    ([name, value]) => ({ name, value })
  );

  const removeChart = (chartId: string) => {
    setActiveCharts(activeCharts.filter((id) => id !== chartId));
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Surveillance Dashboard
      </h1>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={window.innerHeight / 2 - 50}
        onLayoutChange={(layout, layouts) => setLayouts(layouts)}
      >
        {activeCharts.includes("table") && (
          <div key="table" className="bg-gray-800 p-4 rounded overflow-auto">
            <h2 className="text-xl font-bold mb-2 text-white flex justify-between">
              Detections
              <button
                onClick={() => removeChart("table")}
                className="text-red-500"
              >
                &times;
              </button>
            </h2>
            <DetectionTable detections={detections || []} />
          </div>
        )}

        {activeCharts.includes("dailyCount") && (
          <div key="dailyCount" className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2 text-white flex justify-between">
              Daily Detection Count
              <button
                onClick={() => removeChart("dailyCount")}
                className="text-red-500"
              >
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
          </div>
        )}

        {activeCharts.includes("hourlyTrend") && (
          <div key="hourlyTrend" className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2 text-white flex justify-between">
              Hourly Detection Trend
              <button
                onClick={() => removeChart("hourlyTrend")}
                className="text-red-500"
              >
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
          </div>
        )}

        {activeCharts.includes("cameraActivity") && (
          <div key="cameraActivity" className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2 text-white flex justify-between">
              Camera Activity
              <button
                onClick={() => removeChart("cameraActivity")}
                className="text-red-500"
              >
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
          </div>
        )}

        {activeCharts.includes("objectType") && (
          <div key="objectType" className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2 text-white flex justify-between">
              Object Type Distribution
              <button
                onClick={() => removeChart("objectType")}
                className="text-red-500"
              >
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
          </div>
        )}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
