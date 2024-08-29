import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetections, fetchCameras } from "../utils/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Detection, Camera } from "../types";

const Dashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Detection>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCharts, setSelectedCharts] = useState([
    "daily",
    "hourly",
    "camera",
  ]);
  const itemsPerPage = 10;

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

  // Prepare data for daily detection count chart
  const dailyDetectionCount = detections?.reduce((acc, detection) => {
    const date = new Date(detection.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dailyChartData = Object.entries(dailyDetectionCount || {}).map(
    ([date, count]) => ({ date, count })
  );

  // Prepare data for hourly detection trend
  const hourlyDetectionTrend = detections?.reduce((acc, detection) => {
    const hour = new Date(detection.timestamp).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const hourlyChartData = Object.entries(hourlyDetectionTrend || {}).map(
    ([hour, count]) => ({ hour: Number(hour), count })
  );

  // Prepare data for camera activity comparison
  const cameraActivity = detections?.reduce((acc, detection) => {
    acc[detection.cameraId] = (acc[detection.cameraId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cameraChartData = Object.entries(cameraActivity || {}).map(
    ([cameraId, count]) => ({ cameraId, count })
  );

  // Filter and sort detections
  const filteredDetections =
    detections
      ?.filter(
        (detection) =>
          detection.objectType
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          detection.cameraId.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }) || [];

  const totalPages = Math.ceil(filteredDetections.length / itemsPerPage);
  const paginatedDetections = filteredDetections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Surveillance Dashboard
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search detections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        />
      </div>

      <div className="mb-4">
        <label className="text-white mr-2">Charts to display:</label>
        {["daily", "hourly", "camera"].map((chart) => (
          <label key={chart} className="mr-4 text-white">
            <input
              type="checkbox"
              checked={selectedCharts.includes(chart)}
              onChange={() =>
                setSelectedCharts((prev) =>
                  prev.includes(chart)
                    ? prev.filter((c) => c !== chart)
                    : [...prev, chart]
                )
              }
            />
            {chart}
          </label>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {selectedCharts.includes("daily") && (
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2 text-white">
              Daily Detection Count
            </h2>
            <ResponsiveContainer width="100%" height={300}>
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

        {selectedCharts.includes("hourly") && (
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2 text-white">
              Hourly Detection Trend
            </h2>
            <ResponsiveContainer width="100%" height={300}>
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

        {selectedCharts.includes("camera") && (
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2 text-white">
              Camera Activity Comparison
            </h2>
            <ResponsiveContainer width="100%" height={300}>
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
      </div>

      <h2 className="text-2xl font-bold mb-4 text-white">Detections Table</h2>
      <table className="w-full mb-4">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th
              className="p-2 cursor-pointer"
              onClick={() => {
                setSortBy("id");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              ID
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => {
                setSortBy("timestamp");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Timestamp
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => {
                setSortBy("cameraId");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Camera
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => {
                setSortBy("objectType");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Object Type
            </th>
            <th
              className="p-2 cursor-pointer"
              onClick={() => {
                setSortBy("confidenceScore");
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
            >
              Confidence
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedDetections.map((detection) => (
            <tr key={detection.id} className="text-white">
              <td className="p-2">{detection.id}</td>
              <td className="p-2">
                {new Date(detection.timestamp).toLocaleString()}
              </td>
              <td className="p-2">{detection.cameraId}</td>
              <td className="p-2">{detection.objectType}</td>
              <td className="p-2">{detection.confidenceScore.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center text-white">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
