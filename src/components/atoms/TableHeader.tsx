import React from "react";

interface TableHeaderProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ children, onClick }) => {
  return (
    <th
      className="px-4 py-2 cursor-pointer text-xs text-gray-400 uppercase"
      onClick={onClick}
    >
      {children}
    </th>
  );
};

export default TableHeader;
