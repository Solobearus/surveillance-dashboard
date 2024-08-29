// components/CameraStream.tsx
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetections, fetchCameras } from "../api";
import { Detection, Camera } from "../types";
import DetectionTable from "./DetectionTable";
import Hls from "hls.js";

const CameraStream: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  useEffect(() => {
    if (selectedCamera && videoRef.current) {
      const camera = cameras?.find((c) => c.id === selectedCamera);
      if (camera && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(camera.streamUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          videoRef.current?.play();
        });
      }
    }
  }, [selectedCamera, cameras]);

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
            <video
              ref={videoRef}
              className="w-full h-[calc(100%-40px)]"
              controls
            />
          ) : (
            <div className="w-full h-[calc(100%-40px)] flex items-center justify-center bg-gray-700">
              <p>Select a camera to view the stream</p>
            </div>
          )}
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Recent Detections</h2>
          {selectedCamera ? (
            <DetectionTable
              detections={detections || []}
              currentCameraId={selectedCamera}
            />
          ) : (
            <div className="w-full h-[calc(100%-40px)] flex items-center justify-center bg-gray-700">
              <p>Select a camera to view detections</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraStream;
