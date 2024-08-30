import React from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block mb-1 text-gray-300">
          Min: {value.min.toFixed(2)}
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.min}
          onChange={(e) =>
            onChange({ ...value, min: parseFloat(e.target.value) })
          }
          className="w-full"
        />
      </div>
      <div>
        <label className="block mb-1 text-gray-300">
          Max: {value.max.toFixed(2)}
        </label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value.max}
          onChange={(e) =>
            onChange({ ...value, max: parseFloat(e.target.value) })
          }
          className="w-full"
        />
      </div>
    </div>
  );
};

export default RangeSlider;
