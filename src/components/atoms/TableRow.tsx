import React from "react";

interface TableRowProps {
  children: React.ReactNode;
}

const TableRow: React.FC<TableRowProps> = ({ children }) => {
  return <tr className="bg-gray-800 border-b border-gray-700">{children}</tr>;
};

export default TableRow;
