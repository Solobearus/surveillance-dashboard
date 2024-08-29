import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Detection } from "../types";
import { toast } from "react-toastify";

export function useWebSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const newDetection = JSON.parse(event.data);

      const fixedNewDetection: Detection = {
        ...newDetection,
        confidenceScore: parseFloat(newDetection.confidenceScore),
      };

      queryClient.setQueryData<Detection[]>(["detections"], (old) => {
        if (old) {
          return [fixedNewDetection, ...old];
        }
        return [fixedNewDetection];
      });
      toast(
        `New detection: ${fixedNewDetection.objectType} on ${fixedNewDetection.cameraId}`
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Failed to connect to WebSocket server");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [queryClient]);
}
