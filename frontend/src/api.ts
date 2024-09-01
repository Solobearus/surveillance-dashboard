import axios from "axios";
import { Detection, Camera } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchDetections = async (): Promise<Detection[]> => {
  const response = await axios.get(`${API_URL}/detections`);
  return response.data;
};

export const fetchCameras = async (): Promise<Camera[]> => {
  const response = await axios.get(`${API_URL}/cameras`);
  return response.data;
};
