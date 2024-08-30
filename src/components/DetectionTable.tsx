import React, { useMemo, useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import { Detection } from "../types";
import Table from "./atoms/Table";
import TableHeader from "./atoms/TableHeader";
import TableRow from "./atoms/TableRow";
import TableCell from "./atoms/TableCell";
import Button from "./atoms/Button";

interface DetectionTableProps {
  detections: Detection[];
  currentCameraId?: string;
  itemsPerPage?: number;
}

const TABLE_COLUMNS: (keyof Detection)[] = [
  "id",
  "timestamp",
  "cameraId",
  "objectType",
  "confidenceScore",
];

const DetectionTable: React.FC<DetectionTableProps> = ({
  detections,
  currentCameraId,
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Detection>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const filteredDetections = useMemo(() => {
    return detections
      .filter(
        (detection) =>
          (currentCameraId ? detection.cameraId === currentCameraId : true) &&
          (detection.objectType
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
            detection.cameraId
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [detections, currentCameraId, debouncedSearchTerm, sortBy, sortOrder]);

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
    <div className="flex flex-col flex-1 overflow-scroll-y">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search detections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <thead>
            <TableRow>
              {TABLE_COLUMNS.map((column) => (
                <TableHeader key={column} onClick={() => handleSort(column)}>
                  {column}
                  {sortBy === column && (sortOrder === "asc" ? " ▲" : " ▼")}
                </TableHeader>
              ))}
            </TableRow>
          </thead>
          <tbody>
            {paginatedDetections.map((detection: Detection) => (
              <TableRow key={detection.id}>
                <TableCell>{detection.id}</TableCell>
                <TableCell>
                  {new Date(detection.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{detection.cameraId}</TableCell>
                <TableCell>{detection.objectType}</TableCell>
                <TableCell>{detection.confidenceScore.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-2 flex justify-between items-center">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DetectionTable;
