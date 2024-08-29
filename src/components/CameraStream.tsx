import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCameras, fetchDetections } from "../utils/api";
import Hls from "hls.js";

const CameraStream: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );

  const { data: cameras } = useQuery({
    queryKey: ["cameras"],
    queryFn: fetchCameras,
  });

  const { data: detections } = useQuery({
    queryKey: ["detections"],
    queryFn: fetchDetections,
  });

  useEffect(() => {
    if (selectedCamera && videoElement) {
      const camera = cameras?.find((c) => c.id === selectedCamera);
      if (camera && Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(camera.streamUrl);
        hls.attachMedia(videoElement);
      }
    }
  }, [selectedCamera, videoElement, cameras]);

  const filteredDetections =
    detections?.filter((d) => d.cameraId === selectedCamera) || [];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Camera Stream</h1>
      <div className="mb-4">
        <select
          value={selectedCamera || ""}
          onChange={(e) => setSelectedCamera(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white"
        >
          <option value="">Select a camera</option>
          {cameras?.map((camera) => (
            <option key={camera.id} value={camera.id}>
              {camera.name}
            </option>
          ))}
        </select>
      </div>
      {selectedCamera && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <video
              ref={(el) => setVideoElement(el)}
              controls
              className="w-full rounded"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Detections</h2>
            <ul className="bg-gray-800 rounded p-4">
              {filteredDetections.slice(0, 10).map((detection) => (
                <li key={detection.id} className="mb-2">
                  {new Date(detection.timestamp).toLocaleString()} -{" "}
                  {detection.objectType} (Confidence:{" "}
                  {detection.confidenceScore.toFixed(2)})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraStream;
