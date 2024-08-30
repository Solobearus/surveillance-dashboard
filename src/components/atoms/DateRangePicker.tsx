import React from "react";

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block mb-1 text-gray-300">Start Date:</label>
        <input
          type="datetime-local"
          value={startDate ? startDate.toISOString().slice(0, 16) : ""}
          onChange={(e) =>
            onChange(e.target.value ? new Date(e.target.value) : null, endDate)
          }
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-300">End Date:</label>
        <input
          type="datetime-local"
          value={endDate ? endDate.toISOString().slice(0, 16) : ""}
          onChange={(e) =>
            onChange(
              startDate,
              e.target.value ? new Date(e.target.value) : null
            )
          }
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
