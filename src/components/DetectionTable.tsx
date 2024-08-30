import React, { useState } from "react";
import { Detection } from "../types";

interface DetectionTableProps {
  detections: Detection[];
  currentCameraId?: string;
  itemsPerPage?: number;
}

const DetectionTable: React.FC<DetectionTableProps> = ({
  detections,
  currentCameraId,
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Detection>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredDetections = detections
    .filter(
      (detection) =>
        (currentCameraId ? detection.cameraId === currentCameraId : true) &&
        (detection.objectType
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          detection.cameraId.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredDetections.length / itemsPerPage);
  const paginatedDetections = filteredDetections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: keyof Detection) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex flex-col overflow-scroll-y flex-1">
      <div className="mb-2 flex-shrink-0">
        <input
          type="text"
          placeholder="Search detections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>

      <div className="flex-1">
        <div className="h-full">
          <table className=" h-full w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700 z-10 ">
              <tr>
                {[
                  "id",
                  "timestamp",
                  "cameraId",
                  "objectType",
                  "confidenceScore",
                ].map((column) => (
                  <th
                    key={column}
                    className="px-4 py-2 cursor-pointer"
                    onClick={() => handleSort(column as keyof Detection)}
                  >
                    {column}
                    {sortBy === column && (sortOrder === "asc" ? " ▲" : " ▼")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="overflow-hidden ">
              {paginatedDetections.map((detection) => (
                <tr
                  key={detection.id}
                  className="bg-gray-800 border-b border-gray-700"
                >
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {detection.id}
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {new Date(detection.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {detection.cameraId}
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {detection.objectType}
                  </td>
                  <td className="px-4 py-4 text-sm whitespace-nowrap">
                    {detection.confidenceScore.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-2 flex justify-between items-center flex-shrink-0">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-blue-500 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DetectionTable;
