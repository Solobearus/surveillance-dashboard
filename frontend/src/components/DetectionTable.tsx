import React, { useMemo, useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { Detection } from "../types";
import Table from "./atoms/Table";
import TableHeader from "./atoms/TableHeader";
import TableRow from "./atoms/TableRow";
import TableCell from "./atoms/TableCell";
import Button from "./atoms/Button";
import Popover from "./atoms/Popover";
import MultiSelect from "./atoms/MultiSelect";
import DateRangePicker from "./atoms/DateRangePicker";
import RangeSlider from "./atoms/RangeSlider";

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

  const [timeRange, setTimeRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [selectedCameras, setSelectedCameras] = useState<string[]>([]);
  const [confidenceRange, setConfidenceRange] = useState({ min: 0, max: 1 });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const uniqueCameras = useMemo(
    () => [...new Set(detections.map((d) => d.cameraId))],
    [detections]
  );
  const uniqueTypes = useMemo(
    () => [...new Set(detections.map((d) => d.objectType))],
    [detections]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearchTerm(value);
      }, 300),
    [setDebouncedSearchTerm]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const filteredDetections = useMemo(() => {
    return detections
      .filter((detection) => {
        if (currentCameraId && detection.cameraId !== currentCameraId) {
          return false;
        }
        if (debouncedSearchTerm) {
          const searchLower = debouncedSearchTerm.toLowerCase().trim();
          const matchesSearch = TABLE_COLUMNS.some((column) => {
            const value = detection[column];
            if (value === null || value === undefined) {
              return false;
            }
            const stringValue = String(value).toLowerCase();
            if (column === "timestamp") {
              const date = new Date(value as string);
              return (
                date.toLocaleString().toLowerCase().includes(searchLower) ||
                date.toISOString().toLowerCase().includes(searchLower)
              );
            }
            return stringValue.includes(searchLower);
          });
          if (!matchesSearch) return false;
        }

        // Time range filter
        if (timeRange.start || timeRange.end) {
          const detectionDate = new Date(detection.timestamp);
          if (timeRange.start && detectionDate < timeRange.start) return false;
          if (timeRange.end && detectionDate > timeRange.end) return false;
        }

        // Camera ID filter
        if (
          selectedCameras.length > 0 &&
          !selectedCameras.includes(detection.cameraId)
        )
          return false;

        // Confidence score filter
        if (
          detection.confidenceScore < confidenceRange.min ||
          detection.confidenceScore > confidenceRange.max
        )
          return false;

        // Object type filter
        if (
          selectedTypes.length > 0 &&
          !selectedTypes.includes(detection.objectType)
        )
          return false;

        return true;
      })
      .sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    detections,
    currentCameraId,
    debouncedSearchTerm,
    sortBy,
    sortOrder,
    timeRange,
    selectedCameras,
    confidenceRange,
    selectedTypes,
  ]);

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

  const renderFilterIcon = (column: string) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setActiveFilter(activeFilter === column ? null : column);
      }}
      className="ml-2 focus:outline-none relative z-10"
    >
      🔍
    </button>
  );

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
                  <div className="flex items-center justify-between">
                    <span>{column}</span>
                    <div className="flex items-center">
                      {sortBy === column && (
                        <span className="mr-2">
                          {sortOrder === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                      {(column === "cameraId" ||
                        column === "timestamp" ||
                        column === "objectType" ||
                        column === "confidenceScore") &&
                        renderFilterIcon(column)}
                    </div>
                  </div>
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

      {activeFilter === "cameraId" && (
        <Popover onClose={() => setActiveFilter(null)}>
          <MultiSelect
            options={uniqueCameras}
            selected={selectedCameras}
            onChange={setSelectedCameras}
          />
        </Popover>
      )}

      {activeFilter === "timestamp" && (
        <Popover onClose={() => setActiveFilter(null)}>
          <DateRangePicker
            startDate={timeRange.start}
            endDate={timeRange.end}
            onChange={(start, end) => setTimeRange({ start, end })}
          />
        </Popover>
      )}

      {activeFilter === "objectType" && (
        <Popover onClose={() => setActiveFilter(null)}>
          <MultiSelect
            options={uniqueTypes}
            selected={selectedTypes}
            onChange={setSelectedTypes}
          />
        </Popover>
      )}

      {activeFilter === "confidenceScore" && (
        <Popover onClose={() => setActiveFilter(null)}>
          <RangeSlider
            min={0}
            max={1}
            step={0.01}
            value={confidenceRange}
            onChange={setConfidenceRange}
          />
        </Popover>
      )}

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
