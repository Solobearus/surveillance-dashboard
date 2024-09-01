export interface Detection {
  id: number;
  timestamp: string;
  cameraId: string;
  objectType: "person" | "vehicle" | "animal";
  confidenceScore: number;
}

export interface Camera {
  id: string;
  name: string;
  location: string;
  streamUrl: string;
}

export interface DailyDetectionCount {
  date: string;
  count: number;
}

export interface ObjectTypeDistribution {
  objectType: "person" | "vehicle" | "animal";
  count: number;
}

export interface HourlyDetectionTrend {
  hour: number;
  count: number;
}

export interface CameraActivity {
  cameraId: string;
  detectionCount: number;
}
