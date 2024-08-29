import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDetections, fetchCameras } from "../utils/api";

const Dashboard: React.FC = () => {
  const detectionsQuery = useQuery({
    queryKey: ["detections"],
    queryFn: fetchDetections,
  });

  const camerasQuery = useQuery({
    queryKey: ["cameras"],
    queryFn: fetchCameras,
  });

  if (detectionsQuery.isLoading || camerasQuery.isLoading)
    return <div>Loading...</div>;
  if (detectionsQuery.isError || camerasQuery.isError)
    return <div>Error fetching data</div>;

  return (
    <div>
      <h1>Surveillance Dashboard</h1>
      <h2>Detections</h2>
      <ul>
        {detectionsQuery.data?.map((detection) => (
          <li key={detection.id}>
            {detection.objectType} detected at {detection.timestamp}
          </li>
        ))}
      </ul>
      <h2>Cameras</h2>
      <ul>
        {camerasQuery.data?.map((camera) => (
          <li key={camera.id}>
            {camera.name} - {camera.location}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
