import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetections, fetchCameras } from "../api";
import { Detection, Camera } from "../types";
import DetectionTable from "./DetectionTable";
import { useHLSStream } from "../hooks/useHLSStream";

const CameraStream: React.FC = () => {
  const [currentCameraId, setCurrentCameraId] = useState<string | null>(null);

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

  const videoRef = useHLSStream(currentCameraId, cameras);

  if (detectionsLoading || camerasLoading) return <div>Loading...</div>;

  return (
    <div className="h-full p-6 bg-gray-900 text-white flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Camera Stream</h1>
      <div className="mb-4">
        <select
          className="bg-gray-700 text-white p-2 rounded"
          value={currentCameraId || ""}
          onChange={(e) => setCurrentCameraId(e.target.value)}
        >
          <option value="">Select a camera</option>
          {cameras?.map((camera) => (
            <option key={camera.id} value={camera.id}>
              {camera.id}: {camera.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4 flex flex-col flex-1">
        <div className="bg-gray-800 p-4 rounded flex flex-col">
          <h2 className="text-xl font-bold mb-2">Live Stream</h2>
          {currentCameraId ? (
            <video ref={videoRef} className="w-full flex-1" controls />
          ) : (
            <div className="w-full flex-1 flex items-center justify-center bg-gray-700">
              <p>Select a camera to view the stream</p>
            </div>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded flex flex-col">
          <h2 className="text-xl font-bold mb-2">Recent Detections</h2>
          {currentCameraId ? (
            <DetectionTable
              detections={detections || []}
              config={{ currentCameraId }}
            />
          ) : (
            <div className="w-full flex-1 flex items-center justify-center bg-gray-700">
              <p>Select a camera to view detections</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraStream;
