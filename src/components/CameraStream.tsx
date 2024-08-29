// components/CameraStream.tsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetections, fetchCameras } from "../api";
import { Detection, Camera } from "../types";
import DetectionTable from "./DetectionTable";

const CameraStream: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

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

  return (
    <div className="h-full p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Camera Stream</h1>
      <div className="mb-4">
        <select
          className="bg-gray-700 text-white p-2 rounded"
          value={selectedCamera || ""}
          onChange={(e) => setSelectedCamera(e.target.value)}
        >
          <option value="">Select a camera</option>
          {cameras?.map((camera) => (
            <option key={camera.id} value={camera.id}>
              {camera.id}: {camera.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4 h-[calc(100%-120px)]">
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Live Stream</h2>
          {selectedCamera ? (
            <video className="w-full h-[calc(100%-40px)]" controls>
              <source
                src={cameras?.find((c) => c.id === selectedCamera)?.streamUrl}
                type="application/x-mpegURL"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-[calc(100%-40px)] flex items-center justify-center bg-gray-700">
              <p>Select a camera to view the stream</p>
            </div>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Recent Detections</h2>
          <DetectionTable
            detections={detections || []}
            currentCameraId={selectedCamera || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default CameraStream;
