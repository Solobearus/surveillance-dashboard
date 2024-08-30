import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Detection } from "../types";
import { toast } from "react-toastify";

let ws: WebSocket | null = null;
let attempts = 0;
const maxAttempts = 3;
const retryDelay = 5000;
const url = "ws://localhost:8080";

function connectWebSocket(queryClient: ReturnType<typeof useQueryClient>) {
  if (ws) return; // Prevent multiple connections

  console.log("Connecting to WebSocket server...");
  ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("WebSocket connected");
    attempts = 0; // Reset attempts on successful connection
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
    if (attempts >= maxAttempts) {
      toast.error(
        "Failed to connect to WebSocket server after multiple attempts"
      );
    } else {
      attempts += 1;
      ws = null; // Clear the WebSocket instance
      setTimeout(() => connectWebSocket(queryClient), retryDelay);
    }
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected");
    if (attempts < maxAttempts) {
      ws = null; // Clear the WebSocket instance
      setTimeout(() => connectWebSocket(queryClient), retryDelay);
    }
  };
}

export function useWebSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    connectWebSocket(queryClient);

    return () => {};
  }, [queryClient]);
}
