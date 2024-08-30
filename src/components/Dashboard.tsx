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
    setLayouts({
      lg: layouts.lg.filter((item) => item.i !== chartId),
    });
  };

  const addChart = (chartId: string) => {
    if (!activeCharts.includes(chartId)) {
      setActiveCharts([...activeCharts, chartId]);
      setLayouts({
        lg: [...layouts.lg, getDefaultLayoutItem(chartId)],
      });
    }
  };

  const toggleChart = (chartId: string) => {
    if (activeCharts.includes(chartId)) {
      removeChart(chartId);
    } else {
      addChart(chartId);
    }
  };

  const getDefaultLayoutItem = (chartId: string): LayoutItem => {
    const defaults: { [key: string]: LayoutItem } = {
      table: { i: "table", x: 0, y: 0, w: 6, h: 2 },
      dailyCount: { i: "dailyCount", x: 6, y: 0, w: 3, h: 1 },
      hourlyTrend: { i: "hourlyTrend", x: 9, y: 0, w: 3, h: 1 },
      cameraActivity: { i: "cameraActivity", x: 6, y: 1, w: 3, h: 1 },
      objectType: { i: "objectType", x: 9, y: 1, w: 3, h: 1 },
    };
    return defaults[chartId];
  };

  const charts = {
    table: {
      title: "Detections",
      component: (
        <DetectionTable detections={detections || []} itemsPerPage={7} />
      ),
    },
    dailyCount: {
      title: "Daily Detection Count",
      component: <DailyDetectionChart detections={detections || []} />,
    },
    hourlyTrend: {
      title: "Hourly Detection Trend",
      component: <HourlyDetectionChart detections={detections || []} />,
    },
    cameraActivity: {
      title: "Camera Activity",
      component: <CameraActivityChart detections={detections || []} />,
    },
    objectType: {
      title: "Object Type Distribution",
      component: <ObjectTypeChart detections={detections || []} />,
    },
  };

  return (
    <div className="p-6 bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Surveillance Dashboard
      </h1>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Toggle Charts:</h2>
        {Object.keys(charts).map((chartId) => (
          <label key={chartId} className="text-white mr-4">
            <input
              type="checkbox"
              checked={activeCharts.includes(chartId)}
              onChange={() => toggleChart(chartId)}
              className="mr-1"
            />
            {charts[chartId].title}
          </label>
        ))}
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={window.innerHeight / 2 - 50}
        onLayoutChange={(currentLayout, allLayouts) => setLayouts(allLayouts)}
        draggableHandle=".draggable-handle"
      >
        {activeCharts.map((chartId) => (
          <div
            key={chartId}
            data-grid={layouts.lg.find((layout) => layout.i === chartId)}
            className="bg-gray-800 p-4 rounded flex flex-col h-full w-full"
          >
            <div className="flex justify-between items-center">
              <div className="cursor-pointer draggable-handle flex-1">
                <h2 className="text-xl font-bold text-white ">
                  {charts[chartId].title}
                </h2>
              </div>
              <button
                onClick={() => removeChart(chartId)}
                className="text-red-500 text-xl cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-auto mt-2">
              {charts[chartId].component}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default Dashboard;
