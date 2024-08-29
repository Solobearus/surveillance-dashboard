import { Detection } from "../types";

class MockWebSocket {
  private callbacks: ((data: Detection) => void)[] = [];

  constructor() {
    setInterval(() => {
      this.simulateNewDetection();
    }, 5000);
  }

  onmessage(callback: (data: Detection) => void) {
    this.callbacks.push(callback);
  }

  private simulateNewDetection() {
    const newDetection: Detection = {
      id: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      cameraId: `CAM00${Math.floor(Math.random() * 5) + 1}`,
      objectType: ["person", "vehicle", "animal"][
        Math.floor(Math.random() * 3)
      ] as "person" | "vehicle" | "animal",
      confidenceScore: Math.random(),
    };

    this.callbacks.forEach((callback) => callback(newDetection));
  }
}

export const mockWebSocket = new MockWebSocket();
