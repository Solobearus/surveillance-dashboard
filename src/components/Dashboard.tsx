import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetections, fetchCameras } from "../api";
import { Detection, Camera } from "../types";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DetectionTable from "./DetectionTable";
import DailyDetectionChart from "./charts/DailyDetectionChart";
import HourlyDetectionChart from "./charts/HourlyDetectionChart";
import CameraActivityChart from "./charts/CameraActivityChart";
import ObjectTypeChart from "./charts/ObjectTypeChart";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const Dashboard: React.FC = () => {
  const [layouts, setLayouts] = useState<{ lg: LayoutItem[] }>({
    lg: [
      { i: "table", x: 0, y: 0, w: 6, h: 2 },
      { i: "dailyCount", x: 6, y: 0, w: 3, h: 1 },
      { i: "hourlyTrend", x: 9, y: 0, w: 3, h: 1 },
      { i: "cameraActivity", x: 6, y: 1, w: 3, h: 1 },
      { i: "objectType", x: 9, y: 1, w: 3, h: 1 },
    ],
  });

  const [activeCharts, setActiveCharts] = useState<string[]>([
    "table",
    "dailyCount",
    "hourlyTrend",
    "cameraActivity",
    "objectType",
  ]);

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

  if (detectionsLoading || camerasLoading) {
    return <div className="text-white">Loading...</div>;
  }

  const removeChart = (chartId: string) => {
    setActiveCharts(activeCharts.filter((id) => id !== chartId));
  };

  const renderChart = (chartId: string) => {
    switch (chartId) {
      case "table":
        return (
          <div
            key="table"
            className="bg-gray-800 p-4 rounded overflow-auto flex flex-col"
            data-grid={{ i: "table", x: 0, y: 0, w: 6, h: 2 }}
          >
            <h2 className="text-xl font-bold mb-2 text-white flex justify-between draggable-handle">
              Detections
              <button
                onClick={() => removeChart("table")}
                className="text-red-500"
              >
                &times;
              </button>
            </h2>
            <DetectionTable detections={detections || []} itemsPerPage={7} />
          </div>
        );
      case "dailyCount":
        return (
          <div
            key="dailyCount"
            className="bg-gray-800 p-4 rounded"
            data-grid={{ i: "dailyCount", x: 6, y: 0, w: 3, h: 1 }}
          >
            <DailyDetectionChart
              detections={detections || []}
              onRemove={() => removeChart("dailyCount")}
            />
          </div>
        );
      case "hourlyTrend":
        return (
          <div
            key="hourlyTrend"
            className="bg-gray-800 p-4 rounded"
            data-grid={{ i: "hourlyTrend", x: 9, y: 0, w: 3, h: 1 }}
          >
            <HourlyDetectionChart
              detections={detections || []}
              onRemove={() => removeChart("hourlyTrend")}
            />
          </div>
        );
      case "cameraActivity":
        return (
          <div
            key="cameraActivity"
            className="bg-gray-800 p-4 rounded"
            data-grid={{ i: "cameraActivity", x: 6, y: 1, w: 3, h: 1 }}
          >
            <CameraActivityChart
              detections={detections || []}
              onRemove={() => removeChart("cameraActivity")}
            />
          </div>
        );
      case "objectType":
        return (
          <div
            key="objectType"
            className="bg-gray-800 p-4 rounded"
            data-grid={{ i: "objectType", x: 9, y: 1, w: 3, h: 1 }}
          >
            <ObjectTypeChart
              detections={detections || []}
              onRemove={() => removeChart("objectType")}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-900 ">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Surveillance Dashboard
      </h1>
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={window.innerHeight / 2 - 50}
        onLayoutChange={(_, allLayouts) => setLayouts(allLayouts)}
        draggableHandle=".draggable-handle"
      >
        {activeCharts.map((chartId) => renderChart(chartId))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
