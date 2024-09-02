import React from "react";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
}) => {
  const handleChange = (option: string) => {
    const updatedSelection = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(updatedSelection);
  };

  return (
    <div className="flex flex-col space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center space-x-2 text-gray-300"
        >
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={() => handleChange(option)}
            className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
};

export default MultiSelect;
