import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetections, fetchCameras } from "../api";
import { Detection, Camera } from "../types";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DetectionTable from "./DetectionTable";
import DailyDetectionChart from "./charts/DailyDetectionChart";
import HourlyDetectionChart from "./charts/HourlyDetectionChart";
import CameraActivityChart from "./charts/CameraActivityChart";
import ObjectTypeChart from "./charts/ObjectTypeChart";

const ResponsiveGridLayout = WidthProvider(Responsive);

const chartDefinitions = {
  table: {
    title: "Detections",
    Component: DetectionTable,
    layout: { i: "table", x: 0, y: 0, w: 6, h: 2 },
    visible: true,
  },
  dailyCount: {
    title: "Daily Detection Count",
    Component: DailyDetectionChart,
    layout: { i: "dailyCount", x: 6, y: 0, w: 3, h: 1 },
    visible: true,
  },
  hourlyTrend: {
    title: "Hourly Detection Trend",
    Component: HourlyDetectionChart,
    layout: { i: "hourlyTrend", x: 9, y: 0, w: 3, h: 1 },
    visible: true,
  },
  cameraActivity: {
    title: "Camera Activity",
    Component: CameraActivityChart,
    layout: { i: "cameraActivity", x: 6, y: 1, w: 3, h: 1 },
    visible: true,
  },
  objectType: {
    title: "Object Type Distribution",
    Component: ObjectTypeChart,
    layout: { i: "objectType", x: 9, y: 1, w: 3, h: 1 },
    visible: true,
  },
};

type ChartId = keyof typeof chartDefinitions;

const Dashboard: React.FC = () => {
  const [chartLayouts, setChartLayouts] = useState(chartDefinitions);

  const toggleChart = (chartId: ChartId) => {
    setChartLayouts((prev) => ({
      ...prev,
      [chartId]: { ...prev[chartId], visible: !prev[chartId].visible },
    }));
  };

  const { data: detections, isLoading: detectionsLoading } = useQuery<
    Detection[]
  >({
    queryKey: ["detections"],
    queryFn: fetchDetections,
  });

  const { isLoading: camerasLoading } = useQuery<Camera[]>({
    queryKey: ["cameras"],
    queryFn: fetchCameras,
  });

  if (detectionsLoading || camerasLoading) {
    return <div className="text-white">Loading...</div>;
  }

  const updateLayoutsFromChange = useCallback(
    (layouts: { lg?: Layout[] }) => {
      const updatedLayouts = { ...chartLayouts };
      const lgLayouts = layouts.lg || [];

      for (const layout of lgLayouts) {
        const chartId = layout.i as ChartId;
        updatedLayouts[chartId] = {
          ...chartLayouts[chartId],
          ...layout,
        };
      }

      return updatedLayouts;
    },
    [chartLayouts]
  );

  const layouts = useMemo(
    () => ({
      lg: Object.values(chartLayouts)
        .filter((chart) => chart.visible)
        .map((chart) => chart.layout),
    }),
    [chartLayouts]
  );

  return (
    <div className="p-6 bg-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Surveillance Dashboard
      </h1>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Toggle Charts:</h2>
        {Object.keys(chartDefinitions).map((chartId) => (
          <label key={chartId} className="text-white mr-4">
            <input
              type="checkbox"
              checked={chartLayouts[chartId as ChartId].visible}
              onChange={() => toggleChart(chartId as ChartId)}
              className="mr-1"
            />
            {chartDefinitions[chartId as ChartId].title}
          </label>
        ))}
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={window.innerHeight / 2 - 50}
        onLayoutChange={(_, layouts) => {
          setChartLayouts(updateLayoutsFromChange(layouts));
        }}
        draggableHandle=".draggable-handle"
      >
        {Object.keys(chartLayouts).map((id) => {
          const chart = chartLayouts[id as ChartId];
          return (
            chart.visible && (
              <div key={id} data-grid={chart.layout}>
                <div className="bg-gray-800 p-4 rounded-lg h-full">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white draggable-handle cursor-move">
                      {chart.title}
                    </h3>
                    <button
                      onClick={() => toggleChart(id as ChartId)}
                      className="text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                  <chart.Component
                    detections={detections || []}
                    itemsPerPage={id === "table" ? 7 : undefined}
                  />
                </div>
              </div>
            )
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};

export default React.memo(Dashboard);
