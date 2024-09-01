import React from "react";

interface TableCellProps {
  children: React.ReactNode;
}

const TableCell: React.FC<TableCellProps> = ({ children }) => {
  return <td className="px-4 py-4 text-sm whitespace-nowrap">{children}</td>;
};

export default TableCell;
